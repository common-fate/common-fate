/**
 * Generated by orval v6.9.6 🍺
 * Do not edit manually.
 * Approvals
 * Granted Approvals API
 * OpenAPI spec version: 1.0
 */
import type { TimeConstraints } from './timeConstraints';
import type { ApproverConfig } from './approverConfig';

export type UpdateAccessRuleRequestBody = {
  timeConstraints: TimeConstraints;
  groups: string[];
  approval: ApproverConfig;
  name: string;
  description: string;
  updateMessage?: string;
};
