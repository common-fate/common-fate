package slack

import (
	"github.com/common-fate/granted-approvals/pkg/clio"
	"github.com/common-fate/granted-approvals/pkg/config"
	"github.com/common-fate/granted-approvals/pkg/deploy"
	"github.com/pkg/errors"
	"github.com/urfave/cli/v2"
)

var disableSlackCommand = cli.Command{
	Name:        "disable",
	Description: "disable slack integration",
	Action: func(c *cli.Context) error {
		ctx := c.Context
		f := c.Path("file")

		do, err := deploy.LoadConfig(f)
		if err != nil {
			return err
		}
		_, err = config.DeleteSecret(ctx, config.SlackTokenPath, do.Deployment.Parameters.DeploymentSuffix)
		if err != nil {
			return errors.Wrap(err, "failed while deleting slack parameters in ssm")
		}
		do.Notifications = nil
		err = do.Save(f)
		if err != nil {
			return err
		}
		clio.Success("Successfully deleted slack secrets")
		clio.Warn("Your changes won't be applied until you redeploy. Run 'gdeploy update' to apply the changes to your CloudFormation deployment.")
		return nil
	},
}
