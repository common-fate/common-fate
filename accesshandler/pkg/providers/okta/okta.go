package okta

import (
	"context"

	"github.com/common-fate/granted-approvals/pkg/gconfig"
	"github.com/invopop/jsonschema"
	"github.com/okta/okta-sdk-golang/v2/okta"
	"go.uber.org/zap"
)

type Provider struct {
	client   *okta.Client
	orgURL   gconfig.StringValue
	apiToken gconfig.SecretStringValue
}

func (o *Provider) Config() gconfig.Config {
	return gconfig.Config{
		gconfig.StringField("orgUrl", &o.orgURL, "the Okta organization URL"),
		gconfig.SecretStringField("apiToken", &o.apiToken, "the Okta API token", gconfig.WithArgs("awsssm:///granted/providers/%s/%s", 2)),
	}
}

// Init the Okta provider.
func (o *Provider) Init(ctx context.Context) error {
	zap.S().Infow("configuring okta client", "orgUrl", o.orgURL)

	_, client, err := okta.NewClient(ctx, okta.WithOrgUrl(o.orgURL.Get()), okta.WithToken(o.apiToken.Get()), okta.WithCache(false))
	if err != nil {
		return err
	}
	zap.S().Info("okta client configured")

	o.client = client
	return nil
}

// ArgSchema returns the schema for the Okta provider.
func (o *Provider) ArgSchema() *jsonschema.Schema {
	return jsonschema.Reflect(&Args{})
}
