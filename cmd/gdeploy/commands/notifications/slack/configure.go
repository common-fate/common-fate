package slack

import (
	"bytes"
	"embed"
	"encoding/json"
	"fmt"
	"net/url"
	"strings"
	"text/template"

	"github.com/common-fate/granted-approvals/pkg/clio"
	"github.com/common-fate/granted-approvals/pkg/deploy"
	"github.com/common-fate/granted-approvals/pkg/gconfig"
	slacknotifier "github.com/common-fate/granted-approvals/pkg/notifiers/slack"
	"github.com/urfave/cli/v2"
)

//go:embed templates
var templateFiles embed.FS

var configureSlackCommand = cli.Command{
	Name:        "configure",
	Description: "configure and enable slack integration",
	Action: func(c *cli.Context) error {
		ctx := c.Context
		f := c.Path("file")

		dc, err := deploy.ConfigFromContext(ctx)
		if err != nil {
			return err
		}
		o, err := dc.LoadOutput(ctx)
		if err != nil {
			return err
		}
		apiUrl := o.APIURL

		appManifest, err := RenderSlackAppManifest(SlackManifestConfig{WebhookURL: strings.TrimSuffix(apiUrl, "/") + "/webhook/v1/slack/interactivity"})
		if err != nil {
			return err
		}

		appInstallURL := fmt.Sprintf("https://api.slack.com/apps?new_app=1&manifest_json=%s", url.QueryEscape(appManifest))
		clio.Info("Copy & paste the following link into your web browser to create a new Slack app for Granted Approvals:")
		fmt.Printf("\n\n%s\n\n", appInstallURL)
		clio.Info("After creating the app, install it to your workspace and find your Bot User OAuth Token in the OAuth & Permissions tab.")

		var slack slacknotifier.SlackNotifier
		cfg := slack.Config()
		currentConfig, err := dc.Deployment.Parameters.NotificationsConfiguration.Get("commonfate/notifications/slack@v1")
		if err != nil && err != deploy.ErrFeatureNotDefined {
			return err
		}
		if currentConfig != nil {
			err = cfg.Load(ctx, &gconfig.MapLoader{Values: currentConfig.With})
			if err != nil {
				return err
			}
		}

		for _, v := range cfg {
			err := deploy.CLIPrompt(v)
			if err != nil {
				return err
			}
		}

		// @TODO add the provider test call here before progressing
		// e.g idp.IdentityProvider.TestConfig(ctx)

		// if tests pass, dump the config and update in the deployment config
		slackWith, err := cfg.Dump(ctx, gconfig.SSMDumper{Suffix: dc.Deployment.Parameters.DeploymentSuffix})
		if err != nil {
			return err
		}
		dc.Deployment.Parameters.NotificationsConfiguration.Upsert(deploy.Feature{Uses: "commonfate/notifications/slack@v1", With: slackWith})
		err = dc.Save(f)
		if err != nil {
			return err
		}
		clio.Warn("Your changes won't be applied until you redeploy. Run 'gdeploy update' to apply the changes to your CloudFormation deployment.")
		clio.Success("Successfully enabled Slack")

		return nil
	},
}

type SlackManifestConfig struct {
	WebhookURL string
}

func RenderSlackAppManifest(s SlackManifestConfig) (string, error) {
	tmpl, err := template.ParseFS(templateFiles, "templates/*")
	if err != nil {
		return "", err
	}

	buf := new(bytes.Buffer)
	err = tmpl.ExecuteTemplate(buf, "slack-app-maniftest.json.tmpl", s)
	if err != nil {
		return "", err
	}
	minibuf := new(bytes.Buffer)
	// compact removes whitespace from the json string
	// this allows much nicer escaped URLS
	err = json.Compact(minibuf, buf.Bytes())
	if err != nil {
		return "", err
	}
	return minibuf.String(), nil
}
