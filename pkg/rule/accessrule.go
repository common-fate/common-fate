package rule

import (
	"time"

	"github.com/common-fate/ddb"
	"github.com/common-fate/granted-approvals/accesshandler/pkg/providerregistry"
	"github.com/common-fate/granted-approvals/accesshandler/pkg/providers"
	"github.com/common-fate/granted-approvals/pkg/cache"
	"github.com/common-fate/granted-approvals/pkg/storage/keys"
	"github.com/common-fate/granted-approvals/pkg/types"
)

// AccessRule is a rule governing access to something in Granted.
//
// Access Rules have versions.
// When updating an access rule, you need to update the current version with Current = false
// and then insert the new version with Current = true
// This will correctly set the keys and enable the access patterns
type AccessRule struct {
	// Current is true if this is the current version
	// When a new version is added, the previous version should be updated to set Current to false
	Current bool `json:"current" dynamodbav:"current"`
	// Approver config for access rules
	Approval    Approval `json:"approval" dynamodbav:"approval"`
	Version     string   `json:"version" dynamodbav:"version"`
	Status      Status   `json:"status" dynamodbav:"status"`
	Description string   `json:"description" dynamodbav:"description"`

	// Array of group names that the access rule applies to
	Groups          []string              `json:"groups" dynamodbav:"groups"`
	ID              string                `json:"id" dynamodbav:"id"`
	Metadata        AccessRuleMetadata    `json:"metadata" dynamodbav:"metadata"`
	Name            string                `json:"name" dynamodbav:"name"`
	Target          Target                `json:"target" dynamodbav:"target"`
	TimeConstraints types.TimeConstraints `json:"timeConstraints" dynamodbav:"timeConstraints"`
}

func (a AccessRule) ToAPIDetail() types.AccessRuleDetail {
	status := types.AccessRuleStatusACTIVE
	if a.Status == ARCHIVED {
		status = types.AccessRuleStatusARCHIVED
	}

	// There is an annoying property of json marshalling which gives a nil slice a null value rather than an empty array
	// https://medium.com/swlh/arrays-and-json-in-go-98540f2fa74e
	approval := types.ApproverConfig{}
	if a.Approval.Groups != nil {
		approval.Groups = a.Approval.Groups
	} else {
		approval.Groups = make([]string, 0)
	}
	if a.Approval.Users != nil {
		approval.Users = a.Approval.Users
	} else {
		approval.Users = make([]string, 0)
	}

	return types.AccessRuleDetail{
		ID:          a.ID,
		Description: a.Description,
		Name:        a.Name,
		Metadata: types.AccessRuleMetadata{
			CreatedAt:     a.Metadata.CreatedAt,
			UpdatedAt:     a.Metadata.UpdatedAt,
			UpdateMessage: a.Metadata.UpdateMessage,
			CreatedBy:     a.Metadata.CreatedBy,
			UpdatedBy:     a.Metadata.UpdatedBy,
		},
		Groups: a.Groups,
		TimeConstraints: types.TimeConstraints{
			MaxDurationSeconds: a.TimeConstraints.MaxDurationSeconds,
		},
		Approval: approval,

		Target: a.Target.ToAPI(),

		Status:    status,
		Version:   a.Version,
		IsCurrent: a.Current,
	}
}
func (a AccessRule) ToAPI() types.AccessRule {

	return types.AccessRule{
		ID:          a.ID,
		Version:     a.Version,
		Description: a.Description,
		Name:        a.Name,
		TimeConstraints: types.TimeConstraints{
			MaxDurationSeconds: a.TimeConstraints.MaxDurationSeconds,
		},
		Target:    a.Target.ToAPI(),
		IsCurrent: a.Current,
	}
}

func (a AccessRule) ToRequestAccessRuleDetailAPI(argOptions []cache.ProviderOption) types.RequestAccessRuleDetail {
	ad := types.RequestAccessRuleDetail{
		Version:     a.Version,
		Description: a.Description,
		Name:        a.Name,
		IsCurrent:   a.Current,
		Id:          a.ID,
		With: types.RequestAccessRuleDetail_With{
			AdditionalProperties: make(map[string]types.With),
		},
		Provider:        a.Target.ToAPI().Provider,
		TimeConstraints: a.TimeConstraints,
	}
	// Lookup the provider, ignore errors
	// if provider is not found, fallback to using the argument key as the title
	_, provider, _ := providerregistry.Registry().GetLatestByShortType(a.Target.ProviderType)
	for k, v := range a.Target.With {
		with := types.With{
			Value: v,
			Title: k,
			Label: v,
		}
		// attempt to get the title for the argument from the provider arg schema
		if provider != nil {
			if s, ok := provider.Provider.(providers.ArgSchemarer); ok {
				schema := s.ArgSchema()
				if arg, ok := schema[k]; ok {
					with.Title = arg.Title
				}
			}
		}
		for _, ao := range argOptions {
			// if a value is found, set it to true with a label
			if ao.Arg == k && ao.Value == v {
				with.Label = ao.Label
				with.Description = ao.Description

				break
			}
		}
		ad.With.AdditionalProperties[k] = with
	}
	return ad
}

func (a AccessRule) ToAPIWithSelectables(argOptions []cache.ProviderOption) types.AccessRuleWithSelectables {
	return types.AccessRuleWithSelectables{
		ID:          a.ID,
		Version:     a.Version,
		Description: a.Description,
		Name:        a.Name,
		TimeConstraints: types.TimeConstraints{
			MaxDurationSeconds: a.TimeConstraints.MaxDurationSeconds,
		},
		Target:    a.Target.ToAPIDetail(argOptions),
		IsCurrent: a.Current,
	}
}

// AccessRuleMetadata defines model for AccessRuleMetadata.
type AccessRuleMetadata struct {
	CreatedAt time.Time `json:"createdAt" dynamodbav:"createdAt"`
	// userID
	CreatedBy      string                  `json:"createdBy" dynamodbav:"createdBy"`
	UpdateMessage  *string                 `json:"updateMessage,omitempty" dynamodbav:"updateMessage,omitempty"`
	UpdateMetadata *map[string]interface{} `json:"updateMetadata,omitempty" dynamodbav:"updateMetadata,omitempty"`
	UpdatedAt      time.Time               `json:"updatedAt" dynamodbav:"updatedAt"`
	// userID
	UpdatedBy string `json:"updatedBy" dynamodbav:"updatedBy"`
}

// Approver config for access rules
type Approval struct {
	// List of group ids represents the groups whos members may approver requests for this rule
	Groups []string `json:"groups" dynamodbav:"groups"`
	//List of users ids represents the individual users who may approve requests for this rule.
	// This does not represent members of the approval groups
	Users []string `json:"users" dynamodbav:"users"`
}

func (a *Approval) IsRequired() bool {
	return len(a.Users) > 0 || len(a.Groups) > 0
}

// Provider defines model for Provider.
// I expect this will be different to what gets returned in the api response
type Target struct {
	// References the provider's unique ID
	ProviderID   string            `json:"providerId"  dynamodbav:"providerId"`
	ProviderType string            `json:"providerType"  dynamodbav:"providerType"`
	With         map[string]string `json:"with"  dynamodbav:"with"`
	// when target can have multiple values
	WithSelectable map[string][]string `json:"withSelectable"  dynamodbav:"withSelectable"`
	// when target doesn't have values but instead belongs to a group
	// which can be dynamically fetched at access request time.
	WithDynamicId map[string]map[string][]string `json:"withDynamicId"  dynamodbav:"withDynamicId"`
}

func (t Target) ToAPI() types.AccessRuleTarget {
	return types.AccessRuleTarget{
		Provider: types.Provider{
			Id:   t.ProviderID,
			Type: t.ProviderType,
		},
		With: types.AccessRuleTarget_With{
			AdditionalProperties: t.With,
		},
		WithSelectable: types.AccessRuleTarget_WithSelectable{
			AdditionalProperties: t.WithSelectable,
		},
	}
}

func (t Target) ToAPIDetail(argOptions []cache.ProviderOption) types.AccessRuleTargetDetail {
	at := types.AccessRuleTargetDetail{
		Provider: types.Provider{
			Id:   t.ProviderID,
			Type: t.ProviderType,
		},
		With: types.AccessRuleTargetDetail_With{
			AdditionalProperties: make(map[string]types.With),
		},
		WithSelectable: types.AccessRuleTargetDetail_WithSelectable{
			AdditionalProperties: make(map[string]types.Selectable),
		},
	}

	// Lookup the provider, ignore errors
	// if provider is not found, fallback to using the argument key as the title
	_, provider, _ := providerregistry.Registry().GetLatestByShortType(t.ProviderType)
	for k, v := range t.WithSelectable {
		selectable := types.Selectable{
			Options: make([]types.WithOption, len(v)),
		}
		// attempt to get the title for the argument from the provider arg schema
		if provider != nil {
			if s, ok := provider.Provider.(providers.ArgSchemarer); ok {
				schema := s.ArgSchema()
				if arg, ok := schema[k]; ok {
					selectable.Title = arg.Title
				}
			}
		}
		// If title was not found, fallback to using the arg key as the title
		if selectable.Title == "" {
			selectable.Title = k
		}
		for i, opt := range v {
			// initially set it to false
			selectable.Options[i] = types.WithOption{
				Label: opt,
				Value: opt,
				Valid: false,
			}
			for _, ao := range argOptions {
				// if a value is found, set it to true with a label
				if ao.Arg == k && ao.Value == opt {
					selectable.Options[i] = types.WithOption{
						Label:       ao.Label,
						Value:       opt,
						Valid:       true,
						Description: ao.Description,
					}
					break
				}
			}
		}
		at.WithSelectable.AdditionalProperties[k] = selectable
	}

	for k, v := range t.With {
		with := types.With{
			Value: v,
			Title: k,
			Label: v,
		}
		// attempt to get the title for the argument from the provider arg schema
		if provider != nil {
			if s, ok := provider.Provider.(providers.ArgSchemarer); ok {
				schema := s.ArgSchema()
				if arg, ok := schema[k]; ok {
					with.Title = arg.Title
				}
			}
		}
		for _, ao := range argOptions {
			// if a value is found, set it to true with a label
			if ao.Arg == k && ao.Value == v {
				with.Label = ao.Label
				with.Description = ao.Description
				break
			}
		}
		at.With.AdditionalProperties[k] = with
	}
	return at
}

func (r *AccessRule) DDBKeys() (ddb.Keys, error) {
	// If this is a current version of the rule, then the GSI keys are used
	if r.Current {
		return ddb.Keys{
			PK:     keys.AccessRule.PK1,
			SK:     keys.AccessRule.SK1(r.ID, r.Version),
			GSI1PK: keys.AccessRule.GSI1PK(string(r.Status)),
			GSI1SK: keys.AccessRule.GSI1SK(r.ID),
			GSI2PK: keys.AccessRule.GSI2PK,
			GSI2SK: keys.AccessRule.GSI2SK(r.ID),
		}, nil
	}
	// If this is not a current version of the rule, only the primary keys are used
	return ddb.Keys{
		PK: keys.AccessRule.PK1,
		SK: keys.AccessRule.SK1(r.ID, r.Version),
	}, nil
}
