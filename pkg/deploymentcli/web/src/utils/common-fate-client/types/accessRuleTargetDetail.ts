/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */
import type { Provider } from './provider';
import type { AccessRuleTargetDetailWith } from './accessRuleTargetDetailWith';

/**
 * A detailed target for an access rule
 */
export interface AccessRuleTargetDetail {
  provider: Provider;
  with: AccessRuleTargetDetailWith;
}