package types

// ArgumentCombinations returns a slice of all combinations of arguments
//
// Example
//
//	{"a":[1,2],"b":[3]} -> [{"a":1,"b":3},{"a":2,"b":3}]
//
// This method uses recursion to build a slice of possible combinations of arguments
func (requestWith CreateRequestWith) ArgumentCombinations() []map[string]string {

	if requestWith.AdditionalProperties == nil {
		return nil
	}
	keys := make([]string, 0, len(requestWith.AdditionalProperties))
	for k := range requestWith.AdditionalProperties {
		keys = append(keys, k)
	}

	// This is a depth first search approach to building the combinations
	// for each value of the first argument, create all possible combinations with the other arguments by stepping down through the argument slices
	var combinations []map[string]string
	if len(keys) > 0 {
		for _, value := range requestWith.AdditionalProperties[keys[0]] {
			if len(keys) > 1 {
				combinations = append(combinations, branch(requestWith.AdditionalProperties, keys, map[string]string{keys[0]: value}, 1)...)
			} else {
				combinations = append(combinations, map[string]string{keys[0]: value})
			}
		}
	}
	return combinations
}

func branch(subRequest map[string][]string, keys []string, combination map[string]string, keyIndex int) []map[string]string {
	var combos []map[string]string
	key := keys[keyIndex]
	for _, value := range subRequest[key] {
		// Create the target map
		next := map[string]string{key: value}
		// Copy from the original map to the target map
		for k, v := range combination {
			next[k] = v
		}
		if len(keys) == keyIndex+1 {
			combos = append(combos, next)
		} else {
			combos = append(combos, branch(subRequest, keys, next, keyIndex+1)...)
		}
	}
	return combos
}
