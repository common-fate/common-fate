package slacknotifier

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"

	"github.com/aws/aws-lambda-go/events"
	"github.com/common-fate/common-fate/pkg/access"
	"github.com/common-fate/common-fate/pkg/gevent"
	"github.com/common-fate/common-fate/pkg/notifiers"
	"github.com/common-fate/common-fate/pkg/storage"
	"github.com/common-fate/common-fate/pkg/types"
	"github.com/pkg/errors"
	"github.com/slack-go/slack"
	"go.uber.org/zap"
)

func (n *SlackNotifier) HandleRequestEvent(ctx context.Context, log *zap.SugaredLogger, event events.CloudWatchEvent) error {

	var HAS_SLACK_CLIENT = n.directMessageClient != nil
	var HAS_SLACK_WEBHOOKS = len(n.webhooks) > 0

	var requestorMessage string
	var requestorEmail string
	var requestorMessageFallback string
	var accessory *slack.Accessory

	switch event.DetailType {

	case gevent.RequestCreatedType:

		var requestEvent gevent.RequestCreated
		err := json.Unmarshal(event.Detail, &requestEvent)
		if err != nil {
			return err
		}
		req := requestEvent.Request
		requestor := req.Request.RequestedBy
		requestorEmail = requestEvent.Request.Request.RequestedBy.Email

		// REVIEWERS: for each access group run notification logic...
		for _, group := range req.Groups {

			// if the group is pending approval, notify approvers
			if group.Group.Status == types.RequestAccessGroupStatusPENDINGAPPROVAL {

				// get the requestor's Slack user ID if it exists to render it nicely in the message to approvers.
				var slackUserID string

				slackRequestor, err := n.directMessageClient.client.GetUserByEmailContext(ctx, requestor.Email)
				if err != nil {
					zap.S().Infow("couldn't get slack user from requestor - falling back to email address", "requestor.id", requestor.Email, zap.Error(err))
				}
				if slackRequestor != nil {
					slackUserID = slackRequestor.ID
				}

				reviewURL, err := notifiers.ReviewURL(n.FrontendURL, req.Request.ID)
				if err != nil {
					return errors.Wrap(err, "building review URL")
				}

				if HAS_SLACK_WEBHOOKS {
					reviewerSummary, reviewerMsg := BuildRequestReviewMessage(RequestMessageOpts{
						Group:            group.Group,
						RequestorSlackID: slackUserID,
						ReviewURLs:       reviewURL,
						IsWebhook:        true,
						RequestorEmail:   requestorEmail,
					})

					// log for testing purposes
					if len(n.webhooks) > 0 {
						log.Infow("webhooks found", "webhooks", n.webhooks)
					}

					// send the review message to any configured webhook channels channels
					for _, webhook := range n.webhooks {
						err = webhook.SendWebhookMessage(ctx, reviewerMsg.Blocks, reviewerSummary)
						if err != nil {
							log.Errorw("failed to send review message to incomingWebhook channel", "error", err)
						}
					}
				}

				if HAS_SLACK_CLIENT {

					reviewerSummary, reviewerMsg := BuildRequestReviewMessage(RequestMessageOpts{
						Group:            group.Group,
						RequestorSlackID: slackUserID,
						ReviewURLs:       reviewURL,
						IsWebhook:        false,
						RequestorEmail:   requestorEmail,
					})

					reviewersQuery := storage.ListRequestReviewers{
						RequestId: group.Group.RequestID,
					}
					_, err = n.DB.Query(ctx, &reviewersQuery)
					if err != nil {
						return err
					}

					var wg sync.WaitGroup
					for _, usr := range reviewersQuery.Result {
						wg.Add(1)
						go func(usr access.Reviewer) {
							defer wg.Done()

							approver := storage.GetUser{ID: usr.ReviewerID}
							_, err := n.DB.Query(ctx, &approver)
							if err != nil {
								log.Errorw("failed to fetch user by id while trying to send message in slack", "user.id", usr, zap.Error(err))
								return
							}

							ts, err := SendMessageBlocks(ctx, n.directMessageClient.client, approver.Result.Email, reviewerMsg, reviewerSummary)
							if err != nil {
								log.Errorw("failed to send request approval message", "user", usr, "msg", reviewerMsg, zap.Error(err))
							}

							updatedUsr := usr
							updatedUsr.Notifications = access.Notifications{
								SlackMessageID: &ts,
							}
							log.Infow("updating reviewer with slack msg id", "updatedUsr.SlackMessageID", ts)

							err = n.DB.Put(ctx, &updatedUsr)

							if err != nil {
								log.Errorw("failed to update reviewer", "user", usr, zap.Error(err))
							}
						}(usr)
					}
					wg.Wait()

					if len(group.Group.RequestReviewers) == 0 {
						requestorMessage = fmt.Sprintf("Your request to access *%s* will be automatically approved.", group.Group.AccessRuleSnapshot.Name)
						requestorMessageFallback = fmt.Sprintf("Your request to access %s will be automatically approved.", group.Group.AccessRuleSnapshot.Name)
					} else {
						requestorMessage = fmt.Sprintf("Your request to access *%s* requires approval. We've notified the approvers and will let you know once your request has been reviewed.", group.Group.AccessRuleSnapshot.Name)
						requestorMessageFallback = fmt.Sprintf("Your request to access %s requires approval.", group.Group.AccessRuleSnapshot.Name)
					}

					requestorEmail = requestEvent.Request.Request.RequestedBy.Email
				}

			}

		}
		// REQUESTOR: no-message; sent when approved

	case gevent.RequestCompleteType:

		var requestEvent gevent.RequestComplete
		err := json.Unmarshal(event.Detail, &requestEvent)
		if err != nil {
			return err
		}

		// REQUESTOR Message:
		requestorEmail = requestEvent.Request.Request.RequestedBy.Email
		requestorMessage = fmt.Sprintf("Your access to *%d* Resources has now expired. If you still need access you can send another request using Common Fate.", len(requestEvent.Request.Groups))
		requestorMessageFallback = fmt.Sprintf("Your access to *%d* Resources has now expired.", len(requestEvent.Request.Groups))

		// REVIEWER Message Update:
		n.sendRequestUpdatesReviewer(ctx, log, requestEvent.Request)

	case gevent.RequestCancelCompletedType:

		var requestEvent gevent.RequestCancelled
		err := json.Unmarshal(event.Detail, &requestEvent)
		if err != nil {
			return err
		}

		// REQUESTOR Message: no message

		// REVIEWER Message Update:
		n.sendRequestUpdatesReviewer(ctx, log, requestEvent.Request)

	case gevent.RequestRevokeCompletedType:

		var requestEvent gevent.RequestRevoked
		err := json.Unmarshal(event.Detail, &requestEvent)
		if err != nil {
			return err
		}

		// REQUESTOR Message:
		requestorEmail = requestEvent.Request.Request.RequestedBy.Email
		requestorMessage = fmt.Sprintf("Your access to *%d* Resources has now been revoked. Please contact your cloud administrator for more information.", requestEvent.Request.ToAPI().TargetCount)
		requestorMessageFallback = fmt.Sprintf("Your access to *%d* Resources has now been revoked.", len(requestEvent.Request.Groups))

		// REVIEWER Message Update:
		n.sendRequestUpdatesReviewer(ctx, log, requestEvent.Request)
	}

	if requestorMessage != "" {
		_, err := SendMessage(ctx, n.directMessageClient.client, requestorEmail, requestorMessage, requestorMessageFallback, accessory)
		if err != nil {
			log.Errorw("failed to send requestor message", "error", err)
		}
	}

	return nil
}

func (n *SlackNotifier) sendRequestUpdatesReviewer(ctx context.Context, log *zap.SugaredLogger, req access.RequestWithGroupsWithTargets) {

	var HAS_SLACK_CLIENT = n.directMessageClient != nil
	// var HAS_SLACK_WEBHOOKS = len(n.webhooks) > 0

	requestor := req.Request.RequestedBy

	if HAS_SLACK_CLIENT {

		for _, group := range req.Groups {

			// Loop over the request reviewers...
			for _, reviewer := range group.Group.GroupReviewers {

				reqReviewer := storage.GetRequestReviewer{
					RequestID:  req.Request.ID,
					ReviewerID: reviewer,
				}
				_, err := n.DB.Query(ctx, &reqReviewer)
				if err != nil {
					log.Errorw("failed to get request reviewer", "error", err)
					continue
				}

				reviewURL, err := notifiers.ReviewURL(n.FrontendURL, req.Request.ID)
				if err != nil {
					log.Errorw("building review URL", zap.Error(err))
					return
				}

				reviewerUserObj := storage.GetUser{ID: reviewer}
				_, err = n.DB.Query(ctx, &reviewerUserObj)
				if err != nil {
					log.Errorw("failed to get reviewer user", "error", err)
					continue
				}

				var slackUserID string
				slackRequestor, err := n.directMessageClient.client.GetUserByEmailContext(ctx, requestor.Email)
				if err != nil {
					zap.S().Infow("couldn't get slack user from requestor - falling back to email address", "requestor.id", requestor.Email, zap.Error(err))
				}
				if slackRequestor != nil {
					slackUserID = slackRequestor.ID
				}

				_, slackMsg := BuildRequestReviewMessage(RequestMessageOpts{
					Group:            group.Group,
					ReviewURLs:       reviewURL,
					RequestorEmail:   requestor.Email,
					WasReviewed:      req.Request.RequestStatus != types.PENDING,
					RequestorSlackID: slackUserID,
					RequestReviewer:  reviewerUserObj.Result,
				})

				err = n.UpdateMessageBlockForReviewer(ctx, *reqReviewer.Result, slackMsg)

				if err != nil {
					log.Errorw("failed to send slack message", "user", requestor, zap.Error(err))
				}
			}
		}

	}

	// 🚨🚨 TODO
	//
	// Decide on level of noise,
	// Do we want slack webhooks to trigger on every access group review?
	// if HAS_SLACK_WEBHOOKS {
	// Note: propably don't need webhook alerts here...
	// for _, webhook := range n.webhooks {
	// 	_, msg := BuildRequestDetailMessage(RequestDetailMessageOpts{
	// 		Request: accessGroup,
	// 		// RequestArguments: requestArguments,
	// 		HeadingMessage: headingMsg,
	// 	})
	// 	err := webhook.SendWebhookMessage(ctx, msg.Blocks, summary)
	// 	if err != nil {
	// 		log.Errorw("failed to send slack message to webhook channel", "error", err)
	// 	}
	// }
	// }

}
