// The api package defines all of our REST API endpoints.
package api

import (
	"context"
	"errors"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/benbjohnson/clock"

	"github.com/common-fate/granted-approvals/accesshandler/pkg/providerregistry"
	"github.com/common-fate/granted-approvals/accesshandler/pkg/psetup"
	ahtypes "github.com/common-fate/granted-approvals/accesshandler/pkg/types"
	"github.com/common-fate/granted-approvals/pkg/auth"
	"github.com/common-fate/granted-approvals/pkg/cache"
	"github.com/common-fate/granted-approvals/pkg/cfaws"
	"github.com/common-fate/granted-approvals/pkg/deploy"
	"github.com/common-fate/granted-approvals/pkg/gevent"
	"github.com/common-fate/granted-approvals/pkg/identity"
	"github.com/common-fate/granted-approvals/pkg/identity/identitysync"
	"github.com/common-fate/granted-approvals/pkg/providersetup"
	"github.com/common-fate/granted-approvals/pkg/rule"
	"github.com/common-fate/granted-approvals/pkg/service/accesssvc"
	"github.com/common-fate/granted-approvals/pkg/service/cachesvc"
	"github.com/common-fate/granted-approvals/pkg/service/cognitosvc"
	"github.com/common-fate/granted-approvals/pkg/service/grantsvc"
	"github.com/common-fate/granted-approvals/pkg/service/psetupsvc"
	"github.com/common-fate/granted-approvals/pkg/service/rulesvc"

	"github.com/common-fate/ddb"
	"github.com/common-fate/granted-approvals/pkg/types"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

// API holds all of our API endpoint handlers.
// We use a schema-first approach to ensure that the
// API meets our OpenAPI specification.
//
// To add a new endpoint, follow the below steps:
//
// 1. Edit `openapi.yaml` in this repository.
//
// 2. Run `make generate` to update the generated handler code.
// The code is generated into types.gen.go, and the function
// signatures can be found on the ServerInterface interface.
//
// 3. You'll get a compilation error because API no longer meets
// the ServerInterface interface. The missing function will be your
// new endpoint. Implement the function on API, ensuring that the function
// signature matches the ServerInterface interface.
type API struct {
	// DB is the DynamoDB client which provides direct storage access.
	DB               ddb.Storage
	ProviderMetadata deploy.ProviderMap
	// Requests is the service which provides business logic for Access Requests.
	Access              AccessService
	Rules               AccessRuleService
	ProviderSetup       ProviderSetupService
	AccessHandlerClient ahtypes.ClientWithResponsesInterface
	AdminGroup          string
	Granter             accesssvc.Granter
	Cache               CacheService
	// Set this to nil if cognito is not configured as the IDP for the deployment
	Cognito CognitoService
}

type CognitoService interface {
	CreateUser(ctx context.Context, in cognitosvc.CreateUserOpts) (*identity.User, error)
	CreateGroup(ctx context.Context, in cognitosvc.CreateGroupOpts) (*identity.Group, error)
	UpdateUserGroups(ctx context.Context, in cognitosvc.UpdateUserGroupsOpts) (*identity.User, error)
}

//go:generate go run github.com/golang/mock/mockgen -destination=mocks/mock_providersetup_service.go -package=mocks . ProviderSetupService

// ProviderSetupService contains business logic for managing the guided provider setup workflows.
type ProviderSetupService interface {
	Create(ctx context.Context, providerType string, existingProviders deploy.ProviderMap, r providerregistry.ProviderRegistry) (*providersetup.Setup, error)
	CompleteStep(ctx context.Context, setupID string, stepIndex int, body types.ProviderSetupStepCompleteRequest) (*providersetup.Setup, error)
}

//go:generate go run github.com/golang/mock/mockgen -destination=mocks/mock_access_service.go -package=mocks . AccessService

// RequestServices can create Access Requests.
type AccessService interface {
	CreateRequest(ctx context.Context, user *identity.User, in types.CreateRequestRequest) (*accesssvc.CreateRequestResult, error)
	AddReviewAndGrantAccess(ctx context.Context, opts accesssvc.AddReviewOpts) (*accesssvc.AddReviewResult, error)
	CancelRequest(ctx context.Context, opts accesssvc.CancelRequestOpts) error
}

//go:generate go run github.com/golang/mock/mockgen -destination=mocks/mock_accessrule_service.go -package=mocks . AccessRuleService

// AccessRuleService can create and get rules
type AccessRuleService interface {
	ArchiveAccessRule(ctx context.Context, user *identity.User, in rule.AccessRule) (*rule.AccessRule, error)
	CreateAccessRule(ctx context.Context, user *identity.User, in types.CreateAccessRuleRequest) (*rule.AccessRule, error)
	GetRule(ctx context.Context, ID string, user *identity.User, isAdmin bool) (*rule.AccessRule, error)
	UpdateRule(ctx context.Context, in *rulesvc.UpdateOpts) (*rule.AccessRule, error)
}
type CacheService interface {
	RefreshCachedProviderArgOptions(ctx context.Context, providerId string, argId string) (bool, []cache.ProviderOption, error)
	LoadCachedProviderArgOptions(ctx context.Context, providerId string, argId string) (bool, []cache.ProviderOption, error)
}

// API must meet the generated REST API interface.
var _ types.ServerInterface = &API{}

type Opts struct {
	Log                           *zap.SugaredLogger
	AccessHandlerClient           ahtypes.ClientWithResponsesInterface
	ProviderMetadata              deploy.ProviderMap
	EventSender                   *gevent.Sender
	IdentitySyncer                auth.IdentitySyncer
	DynamoTable                   string
	PaginationKMSKeyARN           string
	AdminGroup                    string
	AccessHandlerExecutionRoleARN string
	DeploymentSuffix              string
	CognitoUserPoolID             string
	IDPType                       string
	AdminGroupID                  string
}

// New creates a new API.
func New(ctx context.Context, opts Opts) (*API, error) {
	if opts.Log == nil {
		return nil, errors.New("opts.Log must be provided")
	}
	if opts.AccessHandlerClient == nil {
		return nil, errors.New("AccessHandlerClient must be provided")
	}

	tokenizer, err := ddb.NewKMSTokenizer(ctx, opts.PaginationKMSKeyARN)
	if err != nil {
		return nil, err
	}
	db, err := ddb.New(ctx, opts.DynamoTable, ddb.WithPageTokenizer(tokenizer))
	if err != nil {
		return nil, err
	}

	clk := clock.New()

	a := API{
		ProviderMetadata: opts.ProviderMetadata,
		AdminGroup:       opts.AdminGroup,
		Access: &accesssvc.Service{
			Clock: clk,
			DB:    db,
			Granter: &grantsvc.Granter{
				AHClient: opts.AccessHandlerClient,
				DB:       db,
				Clock:    clk,
				EventBus: opts.EventSender,
			},
			EventPutter: opts.EventSender,
			Cache: &cachesvc.Service{
				DB:                  db,
				AccessHandlerClient: opts.AccessHandlerClient,
			},
		},
		Cache: &cachesvc.Service{
			DB:                  db,
			AccessHandlerClient: opts.AccessHandlerClient,
		},
		Rules: &rulesvc.Service{
			Clock:    clk,
			DB:       db,
			AHClient: opts.AccessHandlerClient,
		},
		ProviderSetup: &psetupsvc.Service{
			DB: db,
			TemplateData: psetup.TemplateData{
				AccessHandlerExecutionRoleARN: opts.AccessHandlerExecutionRoleARN,
			},
			DeploymentSuffix: opts.DeploymentSuffix,
		},
		AccessHandlerClient: opts.AccessHandlerClient,
		DB:                  db,
		Granter: &grantsvc.Granter{
			AHClient: opts.AccessHandlerClient,
			DB:       db,
			Clock:    clk,
			EventBus: opts.EventSender,
		},
	}
	cfg, err := cfaws.ConfigFromContextOrDefault(ctx)
	if err != nil {
		return nil, err
	}
	// only initialise this if cognito is the IDP
	if opts.IDPType == identitysync.IDPTypeCognito {
		a.Cognito = &cognitosvc.Service{
			Clock:             clk,
			DB:                db,
			Syncer:            opts.IdentitySyncer,
			Cognito:           cognitoidentityprovider.NewFromConfig(cfg),
			CognitoUserPoolID: opts.CognitoUserPoolID,
			AdminGroupID:      opts.AdminGroupID,
		}
	}

	return &a, nil
}

// Handler returns a HTTP handler.
// Hander doesn't add any middleware. It is the caller's
// responsibility to add any middleware.
func (a *API) Handler(r chi.Router) http.Handler {
	return types.HandlerWithOptions(a, types.ChiServerOptions{
		BaseRouter: r,
	})
}
