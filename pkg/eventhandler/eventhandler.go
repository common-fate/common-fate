package eventhandler

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/benbjohnson/clock"
	"github.com/common-fate/common-fate/pkg/access"
	"github.com/common-fate/common-fate/pkg/config"
	"github.com/common-fate/common-fate/pkg/deploy"
	"github.com/common-fate/common-fate/pkg/gevent"
	"github.com/common-fate/common-fate/pkg/handler"
	slacknotifier "github.com/common-fate/common-fate/pkg/notifiers/slack"
	"github.com/common-fate/common-fate/pkg/service/requestroutersvc"
	"github.com/common-fate/common-fate/pkg/service/workflowsvc"
	"github.com/common-fate/common-fate/pkg/service/workflowsvc/runtimes/local"
	"github.com/common-fate/common-fate/pkg/service/workflowsvc/runtimes/mock"
	"github.com/common-fate/common-fate/pkg/storage"
	"github.com/common-fate/common-fate/pkg/targetgroupgranter"
	"github.com/common-fate/ddb"
	"github.com/common-fate/provider-registry-sdk-go/pkg/handlerclient"
	"github.com/joho/godotenv"
	"github.com/sethvargo/go-envconfig"
	"go.uber.org/zap"
)

type DefaultGetter struct {
}

func (DefaultGetter) GetRuntime(ctx context.Context, h handler.Handler) (*handlerclient.Client, error) {
	return handler.GetRuntime(ctx, h)
}

//go:generate go run github.com/golang/mock/mockgen -destination=mocks/eventputter.go -package=mocks . EventPutter
type EventPutter interface {
	Put(ctx context.Context, detail gevent.EventTyper) error
}

//go:generate go run github.com/golang/mock/mockgen -destination=mocks/mock_workflow_service.go -package=mocks . Workflow
type Workflow interface {
	Revoke(ctx context.Context, requestID string, groupID string, revokerID string, revokerEmail string) error
	Grant(ctx context.Context, requestID string, groupID string) ([]access.GroupTarget, error)
}

// EventHandler provides handler methods for reacting to async actions during the granting process
type EventHandler struct {
	DB            ddb.Storage
	Workflow      Workflow
	Eventbus      EventPutter
	eventQueue    chan gevent.EventTyper
	SlackNotifier slacknotifier.SlackNotifier
}
type LocalDevEventHandlerOpts struct {
	UseMockWorkflowRuntime bool
}
type LocalDevEventHandlerOptsFunc func(*LocalDevEventHandlerOpts)

func WithUseMockWorkflowRuntime(use bool) LocalDevEventHandlerOptsFunc {
	return func(ldeho *LocalDevEventHandlerOpts) {
		ldeho.UseMockWorkflowRuntime = use
	}
}
func NewLocalDevEventHandler(ctx context.Context, db ddb.Storage, clk clock.Clock, opts ...LocalDevEventHandlerOptsFunc) *EventHandler {
	cfg := &LocalDevEventHandlerOpts{
		UseMockWorkflowRuntime: true,
	}
	for _, opt := range opts {
		opt(cfg)
	}
	eh := &EventHandler{
		DB:         db,
		eventQueue: make(chan gevent.EventTyper, 100),
	}

	dc, err := deploy.LoadConfig(deploy.DefaultFilename)
	if err != nil {
		panic(err)
	}

	// don't cache notification config - re-read it every time the Lambda executes.
	// This avoids us using stale config if we're reading config from a remote API,
	// rather than from env vars. This adds latency but this is an async operation
	// anyway so it doesn't really matter.

	var cf config.Config
	_ = godotenv.Load()

	err = envconfig.Process(ctx, &cf)
	if err != nil {
		panic(err)
	}

	notifier := &slacknotifier.SlackNotifier{
		DB:          db,
		FrontendURL: cf.FrontendURL,
	}

	if dc.Deployment.Parameters.NotificationsConfiguration != nil {
		err = notifier.Init(ctx, dc.Deployment.Parameters.NotificationsConfiguration)
		if err != nil {
			panic(err)
		}
		eh.SlackNotifier = *notifier
	}
	var runtime workflowsvc.Runtime

	if cfg.UseMockWorkflowRuntime {
		runtime = mock.NewRuntime(db, eh, &requestroutersvc.Service{
			DB: db,
		})
	} else {
		runtime = local.NewRuntime(db, &targetgroupgranter.Granter{
			DB:          db,
			EventPutter: eh,
			RequestRouter: &requestroutersvc.Service{
				DB: db,
			},
			RuntimeGetter: DefaultGetter{},
		}, &requestroutersvc.Service{
			DB: db,
		})
	}
	wf := &workflowsvc.Service{
		Runtime:  runtime,
		DB:       db,
		Clk:      clk,
		Eventbus: eh,
	}
	eh.Eventbus = eh
	eh.Workflow = wf
	go func() {
		err := eh.startProcessing(ctx)
		if err != nil {
			panic(err)
		}
	}()
	return eh
}

// call StartProcessing to process events from the queue
func (n *EventHandler) startProcessing(ctx context.Context) error {
	for {
		event := <-n.eventQueue
		d, err := json.Marshal(event)
		if err != nil {
			return err
		}

		//handle event for event handler
		err = n.HandleEvent(ctx, events.CloudWatchEvent{
			DetailType: event.EventType(),
			Detail:     d,
		})
		if err != nil {
			return err
		}

		//handle event for slack notifier
		err = n.SlackNotifier.HandleEvent(ctx, events.CloudWatchEvent{
			DetailType: event.EventType(),
			Detail:     d,
		})
		if err != nil {
			return err
		}
	}
}

// Put allows the event handler to be used in place of the event putter interface in development
func (n *EventHandler) Put(ctx context.Context, detail gevent.EventTyper) error {
	n.eventQueue <- detail
	return nil
}

func (n *EventHandler) HandleEvent(ctx context.Context, event events.CloudWatchEvent) (err error) {
	log := zap.S().With("event", event)
	log.Info("received event from eventbridge")
	if strings.HasPrefix(event.DetailType, "grant") {
		err = n.HandleGrantEvent(ctx, log, event)
		if err != nil {
			return err
		}
	} else if strings.HasPrefix(event.DetailType, "request") {
		err = n.HandleRequestEvents(ctx, log, event)
		if err != nil {
			return err
		}

	} else if strings.HasPrefix(event.DetailType, "accessGroup") {
		err = n.HandleAccessGroupEvents(ctx, log, event)
		if err != nil {
			return err
		}

	} else {
		log.Info("ignoring unhandled event type", event.DetailType)
	}
	return nil
}

func (n *EventHandler) GetRequestFromDatabase(ctx context.Context, requestID string) (*access.RequestWithGroupsWithTargets, error) {
	q := storage.GetRequestWithGroupsWithTargets{
		ID: requestID,
	}
	// uses consistent read to ensure that we always get the latest version of the request
	_, err := n.DB.Query(ctx, &q, ddb.ConsistentRead())
	if err != nil {
		return nil, err
	}
	return q.Result, nil
}

func (n *EventHandler) GetGroupFromDatabase(ctx context.Context, requestID string, groupID string) (*access.GroupWithTargets, error) {
	q := storage.GetRequestGroupWithTargets{
		RequestID: requestID,
		GroupID:   groupID,
	}
	// uses consistent read to ensure that we always get the latest version of the request
	_, err := n.DB.Query(ctx, &q, ddb.ConsistentRead())
	if err != nil {
		return nil, err
	}
	return q.Result, nil
}
