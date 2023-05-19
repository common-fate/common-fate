/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */

/**
 * The status of a grant.

 */
export type RequestAccessGroupTargetStatus = typeof RequestAccessGroupTargetStatus[keyof typeof RequestAccessGroupTargetStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RequestAccessGroupTargetStatus = {
  PENDING_PROVISIONING: 'PENDING_PROVISIONING',
  AWAITING_START: 'AWAITING_START',
  ACTIVE: 'ACTIVE',
  ERROR: 'ERROR',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED',
} as const;
