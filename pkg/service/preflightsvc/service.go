package preflightsvc

import (
	"context"

	"github.com/benbjohnson/clock"
	"github.com/common-fate/common-fate/pkg/access"
	"github.com/common-fate/common-fate/pkg/cache"
	"github.com/common-fate/common-fate/pkg/identity"

	"github.com/common-fate/common-fate/pkg/rule"
	"github.com/common-fate/common-fate/pkg/storage"
	"github.com/common-fate/common-fate/pkg/types"
	"github.com/common-fate/ddb"
)

type Service struct {
	DB    ddb.Storage
	Clock clock.Clock
}

func ValidateNoDuplicates(preflightRequest types.CreatePreflightRequest) error {
	// Create a map to keep track of the seen targets
	seenTargets := make(map[string]bool)

	// Loop through each target in the request
	for _, target := range preflightRequest.Targets {
		// If the target has already been seen, return an error
		if seenTargets[target] {
			return ErrDuplicateTargetIDsRequested
		}

		// Otherwise, mark the target as seen
		seenTargets[target] = true
	}

	// If we made it through the loop without finding any duplicates, return nil
	return nil
}

func (s *Service) ValidateAccessToAllTargets(ctx context.Context, user identity.User, preflightRequest types.CreatePreflightRequest) ([]cache.Target, error) {
	// targets must all exist
	var targets []cache.Target
	for _, targetID := range preflightRequest.Targets {
		q := storage.GetCachedTarget{
			ID: targetID,
		}
		_, err := s.DB.Query(ctx, &q)
		if err != nil {
			return nil, err
		}
		targets = append(targets, *q.Result)
	}

	// user must have access to all targets
	filtered := cache.Filter(targets, user.Groups)
	if len(filtered) < len(targets) {
		return nil, ErrUserNotAuthorisedForRequestedTarget
	}

	return filtered, nil
}

// Takes in a list of targets and groups them by access rule
// then returns a preflight object
func (s *Service) ProcessPreflight(ctx context.Context, user identity.User, preflightRequest types.CreatePreflightRequest) (*access.Preflight, error) {

	// validate that there are no duplicates
	err := ValidateNoDuplicates(preflightRequest)
	if err != nil {
		return nil, err
	}
	// validate that the user has access to all the targets
	targets, err := s.ValidateAccessToAllTargets(ctx, user, preflightRequest)
	if err != nil {
		return nil, err
	}
	// group the targets

	accessGroups, err := s.GroupTargets(ctx, targets, user)
	if err != nil {
		return nil, err
	}
	// save the preflight and return
	now := s.Clock.Now()
	preflight := access.Preflight{
		ID:           types.NewPreflightID(),
		RequestedBy:  user.ID,
		CreatedAt:    now,
		AccessGroups: accessGroups,
	}
	//create a preflight object in the db
	err = s.DB.Put(ctx, &preflight)
	if err != nil {
		return nil, err
	}

	return &preflight, nil
}

func (s *Service) UserCanAccessRule(ctx context.Context, user identity.User, a rule.AccessRule) (bool, error) {

	userGroups := map[string]string{}

	for _, group := range user.Groups {
		userGroups[group] = group
	}
	for _, groupId := range a.Groups {
		if _, ok := userGroups[groupId]; ok {
			return true, nil
		}
	}

	return false, nil
}

func (s *Service) GroupTargets(ctx context.Context, targets []cache.Target, user identity.User) ([]access.PreflightAccessGroup, error) {
	//goal of the group targets method is to get an unsorted list of targets and return the targets grouped into access groups
	//the method of grouping is subject for change/options going forward

	deduplicatedAccessGroups := map[string]access.PreflightAccessGroup{}

	//The current method of grouping is getting the access rule of least resistance for each target.

	for _, target := range targets {

		bestAccessRule := rule.AccessRule{}
		for id := range target.AccessRules {

			ar := storage.GetAccessRule{ID: id}
			_, err := s.DB.Query(ctx, &ar)
			if err != nil {
				return nil, err
			}
			//check if user has access to this rule
			canAccess, err := s.UserCanAccessRule(ctx, user, *ar.Result)
			if err != nil {
				return nil, err
			}
			if canAccess {
				bestAccessRule = CompareAccessRules(bestAccessRule, *ar.Result)
			}

		}

		t := access.PreflightAccessGroupTarget{
			Target:        target,
			TargetGroupID: target.AccessRules[bestAccessRule.ID].MatchedTargetGroups[0],
		}
		_, exists := deduplicatedAccessGroups[bestAccessRule.ID]
		if exists {
			ag := deduplicatedAccessGroups[bestAccessRule.ID]
			ag.Targets = append(deduplicatedAccessGroups[bestAccessRule.ID].Targets, t)
			deduplicatedAccessGroups[bestAccessRule.ID] = ag
		} else {
			//create new access group

			newAccessGroup := access.PreflightAccessGroup{
				ID:               types.NewAccessGroupID(),
				AccessRule:       bestAccessRule.ID,
				RequiresApproval: bestAccessRule.Approval.IsRequired(),

				TimeConstraints: bestAccessRule.TimeConstraints,
			}
			newAccessGroup.Targets = append(newAccessGroup.Targets, t)

			deduplicatedAccessGroups[bestAccessRule.ID] = newAccessGroup

		}
	}

	res := []access.PreflightAccessGroup{}
	for _, accessGroup := range deduplicatedAccessGroups {
		res = append(res, accessGroup)
	}

	return res, nil
}

// func CompareAccessRules(rule1 rule.AccessRule, rule2 rule.AccessRule) (rule.AccessRule, error) {
// 	// if new rule doesnt require approval, override it
// 	if rule1.Approval.IsRequired() && !rule2.Approval.IsRequired() {
// 		rule1 = rule2
// 	}

// 	//if both rules dont require access, but new rule has longer duration. Override it
// 	if !rule1.Approval.IsRequired() && !rule2.Approval.IsRequired() && rule2.TimeConstraints.MaxDurationSeconds > rule1.TimeConstraints.MaxDurationSeconds {
// 		rule1 = rule2
// 	}

// 	//if both rules require approval, but new rule has longer duration. Override it.
// 	if rule1.Approval.IsRequired() && rule2.Approval.IsRequired() && rule2.TimeConstraints.MaxDurationSeconds > rule1.TimeConstraints.MaxDurationSeconds {
// 		rule1 = rule2

// 	}
// }

func CompareAccessRules(ar1, ar2 rule.AccessRule) rule.AccessRule {

	if ar1.ID == "" {
		return ar2
	}

	if ar2.ID == "" {
		return ar1
	}

	if ar1.Approval.IsRequired() && ar2.Approval.IsRequired() {
		if ar1.TimeConstraints.MaxDurationSeconds > ar2.TimeConstraints.MaxDurationSeconds {
			return ar1 // Return ar1 since it has a longer duration
		} else {
			return ar2 // Return ar2 since it has a longer duration
		}
	}

	if !ar1.Approval.IsRequired() && ar2.Approval.IsRequired() {
		return ar1 // Return ar1 since it doesn't require approval
	} else if ar1.Approval.IsRequired() && !ar2.Approval.IsRequired() {
		return ar2 // Return ar2 since it doesn't require approval
	}

	// At this point, both AccessRules don't require approval
	if ar1.TimeConstraints.MaxDurationSeconds > ar2.TimeConstraints.MaxDurationSeconds {
		return ar1 // Return ar1 since it has a longer duration
	} else {
		return ar2 // Return ar2 since it has a longer duration
	}
}

// func (s *Service) getAccessRuleForTarget(ctx context.Context, accessRules []string) ([], error) {
// 	if len(accessRules) <= 0 {
// 		return nil, errors.New("no access groups found")
// 	}

// 	var currentRule rule.AccessRule

// 	for _, rule := range accessRules {
// 		ar := storage.GetAccessRule{ID: rule}
// 		_, err := s.DB.Query(ctx, &ar)
// 		if err != nil {
// 			return nil, err
// 		}

// 		//from a list of many rules we should return the rule with the lowest barrier for entry for the user...
// 		//pick the one with no approval needed
// 		//with the longest duration

// 		//if first iteration just make the current rule = first
// 		//todo: make test cases for these
// 		if currentRule.ID == "" {
// 			currentRule = *ar.Result
// 			continue
// 		}

// 		//if new rule doesnt require approval, override it
// 		if currentRule.Approval.IsRequired() && !ar.Result.Approval.IsRequired() {
// 			currentRule = *ar.Result
// 		}

// 		//if both rules dont require access, but new rule has longer duration. Override it
// 		if !currentRule.Approval.IsRequired() && !ar.Result.Approval.IsRequired() && ar.Result.TimeConstraints.MaxDurationSeconds > currentRule.TimeConstraints.MaxDurationSeconds {
// 			currentRule = *ar.Result
// 		}

// 		//if both rules require approval, but new rule has longer duration. Override it.
// 		if currentRule.Approval.IsRequired() && ar.Result.Approval.IsRequired() && ar.Result.TimeConstraints.MaxDurationSeconds > currentRule.TimeConstraints.MaxDurationSeconds {
// 			currentRule = *ar.Result

// 		}

// 	}

// 	return nil, nil

// }
