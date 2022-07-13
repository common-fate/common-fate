package slack

import (
	"encoding/json"
	"fmt"

	"github.com/common-fate/granted-approvals/pkg/clio"
	"github.com/common-fate/granted-approvals/pkg/deploy"
	slacknotifier "github.com/common-fate/granted-approvals/pkg/notifiers/slack"
	"github.com/urfave/cli/v2"
)

var testSlackCommand = cli.Command{
	Name:        "test",
	Description: "test slack integration",
	Flags: []cli.Flag{
		&cli.StringFlag{Name: "email", Usage: "A test email to send a private message to", Required: true},
	},
	Action: func(c *cli.Context) error {
		ctx := c.Context
		dc, err := deploy.ConfigFromContext(ctx)
		if err != nil {
			return err
		}
		if dc.Notifications == nil || dc.Notifications.Slack == nil {
			return fmt.Errorf("slack is not yet configured, configure it now by running 'gdeploy notifications slack configure'")
		}
		b, err := json.Marshal(dc.Notifications.Slack)
		if err != nil {
			return err
		}
		err = slacknotifier.SendTestMessage(ctx, c.String("email"), b)
		if err != nil {
			return err
		}
		clio.Success("Successfully send slack test message")
		return nil
	},
}
