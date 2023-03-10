package targetsvc

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"testing"

	"github.com/benbjohnson/clock"
	"github.com/common-fate/common-fate/pkg/storage"
	"github.com/common-fate/common-fate/pkg/target"
	"github.com/common-fate/common-fate/pkg/types"
	"github.com/common-fate/ddb"
	"github.com/common-fate/ddb/ddbmock"
	"github.com/common-fate/provider-registry-sdk-go/pkg/providerregistrysdk"
	"github.com/common-fate/provider-registry-sdk-go/pkg/providerregistrysdk/prmocks"
	"github.com/stretchr/testify/assert"

	"github.com/golang/mock/gomock"
)

func TestCreateTargetGroup(t *testing.T) {
	type testcase struct {
		name                   string
		version                string
		give                   types.CreateTargetGroupRequest
		tgLookupwantErr        error
		wantErr                bool
		want                   *target.Group
		groupId                string
		providerLookupResponse *providerregistrysdk.GetProviderResponse
		providerLookupErr      error
	}
	tg_name := fmt.Sprintf("test_%d", rand.Intn(999))
	clk := clock.NewMock()
	testcases := []testcase{
		{
			name:              "ok",
			version:           "v1.0.1",
			give:              types.CreateTargetGroupRequest{Id: tg_name, TargetSchema: fmt.Sprintf("commonfate/%s@v1.0.1/Kind", tg_name)},
			want:              &target.Group{ID: tg_name, TargetSchema: target.GroupTargetSchema{From: fmt.Sprintf("commonfate/%s@v1.0.1/Kind", tg_name), Schema: providerregistrysdk.Target{}}, Icon: "", CreatedAt: clk.Now(), UpdatedAt: clk.Now()},
			tgLookupwantErr:   ddb.ErrNoItems,
			groupId:           tg_name,
			providerLookupErr: nil,
			providerLookupResponse: &providerregistrysdk.GetProviderResponse{HTTPResponse: &http.Response{StatusCode: 200}, JSON200: &providerregistrysdk.ProviderDetail{
				Publisher: "commonfate",
				Name:      tg_name,
				Version:   "v1.0.1",
				Schema: providerregistrysdk.Schema{
					Schema: "https://schema.commonfate.io/provider/v1alpha1",
					Targets: &map[string]providerregistrysdk.Target{
						"Kind": {},
					},
				},
			}},
		},
		{
			name:              "target group already exists",
			version:           "v1.0.1",
			give:              types.CreateTargetGroupRequest{Id: tg_name, TargetSchema: fmt.Sprintf("commonfate/%s@v1.0.1", tg_name)},
			tgLookupwantErr:   nil,
			want:              nil,
			wantErr:           true,
			groupId:           tg_name,
			providerLookupErr: nil,

			providerLookupResponse: nil,
		},
		{
			name:              "Incorrect target schema format",
			version:           "v1.0.1",
			give:              types.CreateTargetGroupRequest{Id: tg_name, TargetSchema: fmt.Sprintf("commonfate/%s/v1.0.1", tg_name)},
			want:              nil,
			wantErr:           true,
			tgLookupwantErr:   ddb.ErrNoItems,
			groupId:           tg_name,
			providerLookupErr: nil,

			providerLookupResponse: nil,
		},
		{
			name:                   "provider not found",
			version:                "v1.0.1",
			give:                   types.CreateTargetGroupRequest{Id: tg_name, TargetSchema: fmt.Sprintf("commonfate/%s@v1.0.1/Kind", tg_name)},
			want:                   nil,
			wantErr:                true,
			tgLookupwantErr:        ddb.ErrNoItems,
			groupId:                tg_name,
			providerLookupErr:      ErrProviderNotFoundInRegistry,
			providerLookupResponse: &providerregistrysdk.GetProviderResponse{HTTPResponse: &http.Response{StatusCode: 404}},
		},
		{
			name:            "incompatible schema",
			version:         "v1.0.1",
			give:            types.CreateTargetGroupRequest{Id: tg_name, TargetSchema: fmt.Sprintf("commonfate/%s@v1.0.1/Kind", tg_name)},
			wantErr:         true,
			tgLookupwantErr: ddb.ErrNoItems,
			groupId:         tg_name,
			providerLookupResponse: &providerregistrysdk.GetProviderResponse{HTTPResponse: &http.Response{StatusCode: 200}, JSON200: &providerregistrysdk.ProviderDetail{
				Publisher: "commonfate",
				Name:      tg_name,
				Version:   "v1.0.1",
				Schema: providerregistrysdk.Schema{
					Schema: "invalid-schema",
					Targets: &map[string]providerregistrysdk.Target{
						"Kind": {},
					},
				},
			}},
		},
	}

	for _, tc := range testcases {
		t.Run(tc.name, func(t *testing.T) {

			db := ddbmock.New(t)

			db.MockQueryWithErr(&storage.GetTargetGroup{Result: tc.want}, tc.tgLookupwantErr)

			ctrl := gomock.NewController(t)

			defer ctrl.Finish()

			m := prmocks.NewMockClientWithResponsesInterface(ctrl)
			if tc.providerLookupResponse != nil {
				m.EXPECT().GetProviderWithResponse(gomock.Any(), gomock.Eq("commonfate"), gomock.Eq(tc.groupId), gomock.Eq(tc.version)).Return(tc.providerLookupResponse, tc.providerLookupErr)

			}

			s := Service{
				Clock:                  clk,
				DB:                     db,
				ProviderRegistryClient: m,
			}

			got, err := s.CreateGroup(context.Background(), tc.give)

			if (err != nil) != tc.wantErr {
				t.Errorf("TestCreateTargetGroup() error = %v, wantErr %v", err, tc.wantErr)
			}

			assert.Equal(t, tc.want, got)
		})
	}

}
