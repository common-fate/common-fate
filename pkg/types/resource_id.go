package types

import (
	"fmt"

	"github.com/segmentio/ksuid"
)

// newResourceID generates a resource identifier used in our databases.
// Resource identifiers are in the format PREFIX_KSUID
// where PREFIX is a three-letter prefix indiciating the type of resource,
// and KSUID is a KSUID (https://github.com/segmentio/ksuid)
func newResourceID(prefix string) string {
	return fmt.Sprintf("%s_%s", prefix, ksuid.New().String())
}

func NewUserID() string {
	return newResourceID("usr")
}
func NewGroupID() string {
	return newResourceID("grp")
}
func NewGroupTargetID() string {
	return newResourceID("gta")
}

func NewRequestFavoriteID() string {
	return newResourceID("rqf")
}
func NewAccessRuleID() string {
	return newResourceID("rul")
}

func NewRequestID() string {
	return newResourceID("req")
}

func NewRequestReviewID() string {
	return newResourceID("rev")
}

func NewDeploymentID() string {
	return newResourceID("dep")
}
func NewGrantID() string {
	return newResourceID("gra")
}

func NewOptionID() string {
	return newResourceID("opt")
}
func NewAccessGroupID() string {
	return newResourceID("agi")
}
func NewTargetID() string {
	return newResourceID("tar")
}
func NewPreflightID() string {
	return newResourceID("pre")
}

func NewAccessTemplateID() string {
	return newResourceID("tmp")
}

func NewHistoryID() string {
	return newResourceID("his")
}
