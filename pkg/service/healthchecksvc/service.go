package healthchecksvc

import (
	"github.com/common-fate/ddb"
)

// Service holds business logic relating to Access Requests.
type Service struct {
	DB ddb.Storage
}