/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */
import type { RequestAccessGroupStatus } from './requestAccessGroupStatus';
import type { RequestAccessGroupTiming } from './requestAccessGroupTiming';
import type { RequestRequestedBy } from './requestRequestedBy';
import type { RequestAccessGroupTarget } from './requestAccessGroupTarget';
import type { RequestAccessGroupApprovalMethod } from './requestAccessGroupApprovalMethod';
import type { RequestAccessGroupAccessRule } from './requestAccessGroupAccessRule';
import type { RequestStatus } from './requestStatus';
import type { RequestAccessGroupFinalTiming } from './requestAccessGroupFinalTiming';

export interface RequestAccessGroup {
  id: string;
  requestId: string;
  status: RequestAccessGroupStatus;
  requestedTiming: RequestAccessGroupTiming;
  overrideTiming?: RequestAccessGroupTiming;
  updatedAt: string;
  createdAt: string;
  requestedBy: RequestRequestedBy;
  targets: RequestAccessGroupTarget[];
  approvalMethod?: RequestAccessGroupApprovalMethod;
  accessRule: RequestAccessGroupAccessRule;
  requestStatus: RequestStatus;
  requestReviewers?: string[];
  groupReviewers?: string[];
  finalTiming?: RequestAccessGroupFinalTiming;
}
