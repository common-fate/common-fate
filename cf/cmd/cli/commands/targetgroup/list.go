package targetgroup

import (
	"os"

	"github.com/common-fate/clio"
	"github.com/common-fate/common-fate/pkg/types"
	"github.com/olekukonko/tablewriter"
	"github.com/urfave/cli/v2"
)

var ListCommand = cli.Command{
	Name:        "list",
	Description: "list target groups",
	Usage:       "list target groups",
	Action: cli.ActionFunc(func(c *cli.Context) error {

		opts := []types.ClientOption{}
		ctx := c.Context

		cfApi, err := types.NewClientWithResponses("http://0.0.0.0:8080", opts...)
		if err != nil {
			return err
		}
		res, err := cfApi.ListTargetGroupsWithResponse(ctx)
		if err != nil {
			return err
		}

		if res.JSON200 != nil {
			table := tablewriter.NewWriter(os.Stdout)
			table.SetHeader([]string{"ID", "From"})
			table.SetAutoWrapText(false)
			table.SetAutoFormatHeaders(true)
			table.SetHeaderAlignment(tablewriter.ALIGN_LEFT)
			table.SetAlignment(tablewriter.ALIGN_LEFT)
			table.SetCenterSeparator("")
			table.SetColumnSeparator("")
			table.SetRowSeparator("")
			table.SetHeaderLine(false)
			table.SetBorder(false)

			for _, d := range res.JSON200.TargetGroups {

				table.Append([]string{
					d.Id, d.TargetSchema.From,
				})
			}
			table.Render()
		} else {
			clio.Error("no deployments found")
		}

		return nil
	}),
}
