package workflowsvc

import (
	"context"

	"github.com/benbjohnson/clock"
	"github.com/common-fate/apikit/logger"
	"github.com/common-fate/common-fate/pkg/access"
	"github.com/common-fate/common-fate/pkg/gevent"
	"github.com/common-fate/common-fate/pkg/storage"
	"github.com/common-fate/common-fate/pkg/types"
	"github.com/common-fate/ddb"
	"github.com/common-fate/iso8601"
)

// //go:generate go run github.com/golang/mock/mockgen -destination=mocks/runtime.go -package=mocks . Runtime
type Runtime interface {
	// grant is expected to be asyncronous
	Grant(ctx context.Context, grant access.GroupTarget) error
	// revoke is expected to be asyncronous
	Revoke(ctx context.Context, grantID string) error
}

// //go:generate go run github.com/golang/mock/mockgen -destination=mocks/eventputter.go -package=mocks . EventPutter
type EventPutter interface {
	Put(ctx context.Context, detail gevent.EventTyper) error
}
type Service struct {
	Runtime  Runtime
	DB       ddb.Storage
	Clk      clock.Clock
	Eventbus EventPutter
}

func (s *Service) Grant(ctx context.Context, requestID string, groupID string) ([]access.GroupTarget, error) {
	log := logger.Get(ctx).With("requestId", requestID, "groupId", groupID)
	log.Info("beginning grant workflow for group")
	q := storage.GetRequestGroupWithTargets{
		RequestID: requestID,
		GroupID:   groupID,
	}
	_, err := s.DB.Query(ctx, &q, ddb.ConsistentRead())
	if err != nil {
		return nil, err
	}
	group := q.Result

	start, end := group.Group.GetInterval(access.WithNow(s.Clk.Now()))

	//update the group with the start and end time

	group.Group.FinalTiming = &access.FinalTiming{
		Start: start,
		End:   end,
	}
	err = s.DB.Put(ctx, &group.Group)
	if err != nil {
		return nil, err
	}

	log.Infow("found group and calculated timing", "group", group, "start", start, "end", end)
	for i, target := range group.Targets {
		target.Grant = &access.Grant{
			Subject: group.Group.RequestedBy.Email,
			Start:   iso8601.New(start),
			End:     iso8601.New(end),
			Status:  types.RequestAccessGroupTargetStatusAWAITINGSTART,
		}

		err := s.Runtime.Grant(ctx, target)
		if err != nil {
			//override the status here to error
			target.Grant.Status = types.RequestAccessGroupTargetStatusERROR
			evt := gevent.GrantFailed{
				Grant:  target,
				Reason: err.Error(),
			}
			err = s.Eventbus.Put(ctx, evt)
			if err != nil {
				return nil, err
			}
		}

		group.Targets[i] = target

	}
	err = s.DB.PutBatch(ctx, group.DBItems()...)
	if err != nil {
		return nil, err
	}
	return group.Targets, nil
}

// // Revoke attepmts to syncronously revoke access to a request
// // If it is successful, the request is updated in the database, and the updated request is returned from this method
func (s *Service) Revoke(ctx context.Context, requestID string, groupID string, revokerID string, revokerEmail string) error {
	q := storage.GetRequestGroupWithTargets{
		RequestID: requestID,
		GroupID:   groupID,
	}
	_, err := s.DB.Query(ctx, &q, ddb.ConsistentRead())
	if err != nil {
		return err
	}
	group := q.Result
	for _, target := range group.Targets {

		//Cannot request to revoke/cancel grant if it is not active or pending (state function has been created and executed)
		canRevoke := target.Grant.Status == types.RequestAccessGroupTargetStatusACTIVE ||
			target.Grant.Status == types.RequestAccessGroupTargetStatusAWAITINGSTART

		if !canRevoke || target.Grant.End.Before(s.Clk.Now()) {
			return ErrGrantInactive
		}

		log := logger.Get(ctx)
		log.Infow("Can revoke. calling runtime revoke.")

		err = s.Runtime.Revoke(ctx, target.ID)
		if err != nil {
			log.Errorw("error revoking", err)

			return err
		}
		//emit request group revoke event
		err = s.Eventbus.Put(ctx, gevent.GrantRevoked{
			Grant: target,
		})
		if err != nil {
			return err
		}
	}

	return nil
}
