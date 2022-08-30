package notifications

import (
	"github.com/common-fate/granted-approvals/cmd/gdeploy/commands/notifications/slack"
	"github.com/urfave/cli/v2"
)

var Command = cli.Command{
	Name:        "notifications",
	Description: "Configure settings for different medium of getting notify",
	Usage:       "Configure settings for different medium of getting notify",
	Action:      cli.ShowSubcommandHelp,
	Subcommands: []*cli.Command{&slack.Command},
}
