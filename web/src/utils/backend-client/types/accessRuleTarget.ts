/**
 * Generated by orval v6.9.6 🍺
 * Do not edit manually.
 * Approvals
 * Granted Approvals API
 * OpenAPI spec version: 1.0
 */
import type { Provider } from './provider';
import type { AccessRuleTargetWith } from './accessRuleTargetWith';
import type { AccessRuleTargetWithSelectable } from './accessRuleTargetWithSelectable';

/**
 * A target for an access rule
 */
export interface AccessRuleTarget {
  provider: Provider;
  with: AccessRuleTargetWith;
  withSelectable: AccessRuleTargetWithSelectable;
}
