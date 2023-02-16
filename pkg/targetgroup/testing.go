package targetgroup

import "github.com/common-fate/provider-registry-sdk-go/pkg/providerregistrysdk"

// TestAccessRule returns an AccessRule fixture to be used in tests.
func TestTargetGroup(opt ...func(*TargetGroup)) TargetGroup {

	ar := TargetGroup{
		ID:   "test-target-group",
		Icon: "aws-sso",
		TargetSchema: GroupTargetSchema{
			From:   "test/test/v1.1.1",
			Schema: providerregistrysdk.TargetMode_Schema{AdditionalProperties: map[string]providerregistrysdk.TargetArgument{}},
		},
	}

	for _, o := range opt {
		o(&ar)
	}

	return ar
}

func TestTargetGroupDeployment(id string, opt ...func(*Deployment)) Deployment {

	ar := Deployment{
		ID:                    id,
		Runtime:               "aws-lambda",
		AWSAccount:            "123456789012",
		Healthy:               false,
		Diagnostics:           []Diagnostic{},
		TargetGroupAssignment: &TargetGroupAssignment{TargetGroupID: "abc"},
	}

	for _, o := range opt {
		o(&ar)
	}

	return ar
}
