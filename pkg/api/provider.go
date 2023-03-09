package api

import (
	"context"
	"errors"
	"net/http"

	"github.com/common-fate/apikit/apio"
	"github.com/common-fate/apikit/logger"
	ahTypes "github.com/common-fate/common-fate/accesshandler/pkg/types"
	"github.com/common-fate/common-fate/pkg/cache"
	"github.com/common-fate/common-fate/pkg/storage"
	"github.com/common-fate/common-fate/pkg/types"
	"github.com/common-fate/ddb"
)

func (a *API) fetchTargetGroups(ctx context.Context) []types.TargetGroup {
	q := storage.ListTargetGroups{}

	_, err := a.DB.Query(ctx, &q)

	var targetGroups []types.TargetGroup
	// return empty slice if error
	if err != nil {
		return nil
	}

	for _, tg := range q.Result {
		targetGroups = append(targetGroups, tg.ToAPI())
	}

	return targetGroups
}

func (a *API) AdminListProviders(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	res, err := a.AccessHandlerClient.ListProvidersWithResponse(ctx)
	if err != nil {
		apio.Error(ctx, w, err)
		return
	}

	code := res.StatusCode()
	switch code {
	case 200:

		targetGroups := a.fetchTargetGroups(ctx)
		if err != nil {
			apio.Error(ctx, w, err)
			return
		}

		combinedResponse := []ahTypes.Provider{}
		if res.JSON200 != nil {
			combinedResponse = append(combinedResponse, *res.JSON200...)
		}

		for _, target := range targetGroups {
			combinedResponse = append(combinedResponse, ahTypes.Provider{
				Id:   target.Id,
				Type: target.Icon,
			})
		}
		apio.JSON(ctx, w, combinedResponse, code)
		return
	case 500:
		apio.JSON(ctx, w, res.JSON500, code)
		return
	default:
		logger.Get(ctx).Errorw("unhandled access handler response", "response", string(res.Body))
		apio.Error(ctx, w, errors.New("unhandled response code"))
		return
	}
}

func (a *API) AdminGetProvider(w http.ResponseWriter, r *http.Request, providerId string) {
	ctx := r.Context()

	q := storage.GetTargetGroup{ID: providerId}
	_, err := a.DB.Query(ctx, &q)
	if err != nil && err != ddb.ErrNoItems {
		apio.Error(ctx, w, err)
		return
	}

	if q.Result != nil {
		apio.JSON(ctx, w,
			&ahTypes.Provider{
				Id:   q.Result.ID,
				Type: q.Result.Icon,
			}, http.StatusOK)
		return
	}

	res, err := a.AccessHandlerClient.GetProviderWithResponse(ctx, providerId)
	if err != nil {
		apio.Error(ctx, w, err)
		return
	}
	code := res.StatusCode()
	switch code {
	case 200:
		apio.JSON(ctx, w, res.JSON200, code)
		return
	case 404:
		apio.JSON(ctx, w, res.JSON404, code)
		return
	case 500:
		apio.JSON(ctx, w, res.JSON500, code)
		return
	default:
		if err != nil {
			logger.Get(ctx).Errorw("unhandled access handler response", "response", string(res.Body))
			apio.Error(ctx, w, errors.New("unhandled response code"))
			return
		}
	}
}

// helper method to check if the provided id is a valid target group.
func (a *API) isTargetGroup(ctx context.Context, targetGroupId string) bool {
	q := storage.GetTargetGroup{ID: targetGroupId}
	_, _ = a.DB.Query(ctx, &q)
	return q.Result != nil
}

func (a *API) AdminGetProviderArgs(w http.ResponseWriter, r *http.Request, providerId string) {
	ctx := r.Context()

	q := storage.GetTargetGroup{ID: providerId}
	_, err := a.DB.Query(ctx, &q)
	if err != nil && err != ddb.ErrNoItems {
		apio.Error(ctx, w, err)
	}

	// Convert the registry schema to the type required for the API
	if q.Result != nil {
		schema := ahTypes.ArgSchema{
			AdditionalProperties: map[string]ahTypes.Argument{},
		}
		for k, v := range q.Result.TargetSchema.Schema.Properties {
			a := ahTypes.Argument{
				Id:           k,
				Description:  v.Description,
				ResourceName: v.Resource,
				Groups: &ahTypes.Argument_Groups{
					AdditionalProperties: map[string]ahTypes.Group{},
				},
				RuleFormElement: ahTypes.ArgumentRuleFormElementINPUT,
			}
			if v.Title != nil {
				a.Title = *v.Title
			}

			if v.Resource != nil {
				a.RuleFormElement = ahTypes.ArgumentRuleFormElementMULTISELECT
			}
			schema.AdditionalProperties[k] = a
		}

		apio.JSON(ctx, w, schema, http.StatusCreated)
		return
	}

	res, err := a.AccessHandlerClient.GetProviderArgsWithResponse(ctx, providerId)
	if err != nil {
		apio.Error(ctx, w, err)
		return
	}
	code := res.StatusCode()
	switch code {
	case 200:
		apio.JSON(ctx, w, res.JSON200, code)
		return
	case 404:
		apio.JSON(ctx, w, res.JSON404, code)
		return
	case 500:
		apio.JSON(ctx, w, res.JSON500, code)
		return
	default:
		if err != nil {
			logger.Get(ctx).Errorw("unhandled access handler response", "response", string(res.Body))
			apio.Error(ctx, w, errors.New("unhandled response code"))
			return
		}
	}
}

func (a *API) fetchProviderResourcesByResourceType(ctx context.Context, providerId string, resourceType string) ([]ahTypes.Option, error) {
	cachedResources := storage.ListCachedTargetGroupResource{
		TargetGroupID: providerId,
		ResourceType:  resourceType,
	}

	_, err := a.DB.Query(ctx, &cachedResources)
	if err != nil && err != ddb.ErrNoItems {
		return []ahTypes.Option{}, err
	}

	opts := []ahTypes.Option{}
	for _, k := range cachedResources.Result {
		opts = append(opts, ahTypes.Option{
			Label: k.Resource.Name,
			Value: k.Resource.ID,
		})
	}

	return opts, nil
}

// List provider arg options
// (GET /api/v1/admin/providers/{providerId}/args/{argId}/options)
func (a *API) AdminListProviderArgOptions(w http.ResponseWriter, r *http.Request, providerId string, argId string, params types.AdminListProviderArgOptionsParams) {
	ctx := r.Context()

	res := ahTypes.ArgOptionsResponse{
		Options: []ahTypes.Option{},
		Groups:  &ahTypes.Groups{AdditionalProperties: make(map[string][]ahTypes.GroupOption)},
	}

	var err error
	if a.isTargetGroup(ctx, providerId) {
		// argId is either an argument's Id or resource's Name
		res.Options, err = a.fetchProviderResourcesByResourceType(ctx, providerId, argId)
		if err != nil {
			apio.Error(ctx, w, err)
			return
		}

		apio.JSON(ctx, w, res, http.StatusOK)
		return
	}

	var options []cache.ProviderOption
	var groups []cache.ProviderArgGroupOption
	if params.Refresh != nil && *params.Refresh {
		_, options, groups, err = a.Cache.RefreshCachedProviderArgOptions(ctx, providerId, argId)
	} else {
		_, options, groups, err = a.Cache.LoadCachedProviderArgOptions(ctx, providerId, argId)
	}
	if err != nil && err != ddb.ErrNoItems {
		apio.Error(ctx, w, err)
		return
	}

	for _, o := range options {
		res.Options = append(res.Options, ahTypes.Option{
			Label:       o.Label,
			Value:       o.Value,
			Description: o.Description,
		})
	}

	for _, group := range groups {
		res.Groups.AdditionalProperties[group.Group] = append(res.Groups.AdditionalProperties[group.Group], ahTypes.GroupOption{
			Children:    group.Children,
			Label:       group.Label,
			Value:       group.Value,
			Description: group.Description,
			LabelPrefix: group.LabelPrefix,
		})
	}

	apio.JSON(ctx, w, res, http.StatusOK)
}

type ListProvidersArgFilterResponse struct {
	Options []ahTypes.Option `json:"options"`
}
