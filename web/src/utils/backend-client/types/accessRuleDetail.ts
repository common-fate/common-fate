/**
 * Generated by orval v6.9.6 🍺
 * Do not edit manually.
 * Approvals
 * Granted Approvals API
 * OpenAPI spec version: 1.0
 */
import type { AccessRuleStatus } from './accessRuleStatus';
import type { ApproverConfig } from './approverConfig';
import type { AccessRuleMetadata } from './accessRuleMetadata';
import type { AccessRuleTargetDetail } from './accessRuleTargetDetail';
import type { TimeConstraints } from './timeConstraints';

/**
 * AccessRuleDetail contains detailed information about a rule and is used in administrative apis.
 */
export interface AccessRuleDetail {
  id: string;
  /** A unique version identifier for the Access Rule. Updating a rule creates a new version. 
When a rule is updated, it's ID remains consistent.
 */
  version: string;
  status: AccessRuleStatus;
  /** The group IDs that the access rule applies to. */
  groups: string[];
  approval: ApproverConfig;
  name: string;
  description: string;
  metadata: AccessRuleMetadata;
  target: AccessRuleTargetDetail;
  timeConstraints: TimeConstraints;
  isCurrent: boolean;
}
