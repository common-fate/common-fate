package sso

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/organizations"
	"github.com/aws/aws-sdk-go-v2/service/ssoadmin"
	"github.com/common-fate/granted-approvals/accesshandler/pkg/providers"
	"github.com/common-fate/granted-approvals/accesshandler/pkg/types"
	"go.uber.org/zap"
)

// List options for arg
func (p *Provider) Options(ctx context.Context, arg string) ([]types.Option, error) {
	switch arg {
	case "permissionSetArn":
		log := zap.S().With("arg", arg)
		log.Info("getting sso permission set options")
		opts := []types.Option{}
		hasMore := true
		var nextToken *string

		for hasMore {
			o, err := p.client.ListPermissionSets(ctx, &ssoadmin.ListPermissionSetsInput{
				InstanceArn: aws.String(p.instanceARN.Get()),
				NextToken:   nextToken,
			})

			if err != nil {
				return nil, err
			}
			nextToken = o.NextToken
			hasMore = nextToken != nil

			for _, arn := range o.PermissionSets {
				// the user should exist in AWS SSO.
				arnCopy := arn

				po, err := p.client.DescribePermissionSet(ctx, &ssoadmin.DescribePermissionSetInput{
					InstanceArn: aws.String(p.instanceARN.Get()), PermissionSetArn: aws.String(arnCopy),
				})
				if err != nil {
					return nil, err
				}
				hasTag, err := p.checkPermissionSetIsManagedByGranted(ctx, arnCopy)
				if err != nil {
					return nil, err
				}
				if hasTag {
					opts = append(opts, types.Option{Label: *po.PermissionSet.Name, Value: arnCopy})
				}

			}
		}

		return opts, nil
	case "accountId":
		log := zap.S().With("arg", arg)
		log.Info("getting sso permission set options")
		opts := []types.Option{}
		hasMore := true
		var nextToken *string
		for hasMore {
			o, err := p.orgClient.ListAccounts(ctx, &organizations.ListAccountsInput{
				NextToken: nextToken,
			})
			if err != nil {
				return nil, err
			}
			nextToken = o.NextToken
			hasMore = nextToken != nil
			for _, acct := range o.Accounts {
				opts = append(opts, types.Option{Label: aws.ToString(acct.Name), Value: aws.ToString(acct.Id)})
			}
		}
		return opts, nil
	}

	return nil, &providers.InvalidArgumentError{Arg: arg}

}

// checkPermissionSetIsManagedByGranted checks whether the permission set has the "commonfate.io/managed-by-granted" tag
func (p *Provider) checkPermissionSetIsManagedByGranted(ctx context.Context, permissionSetARN string) (bool, error) {
	hasMore := true
	var nextToken *string
	for hasMore {
		tags, err := p.client.ListTagsForResource(ctx, &ssoadmin.ListTagsForResourceInput{
			InstanceArn: aws.String(p.instanceARN.Get()),
			ResourceArn: aws.String(permissionSetARN),
		})
		if err != nil {
			return false, err
		}
		nextToken = tags.NextToken
		hasMore = nextToken != nil
		for _, tag := range tags.Tags {
			if aws.ToString(tag.Key) == "commonfate.io/managed-by-granted" {
				return true, nil
			}
		}
	}
	return false, nil
}
