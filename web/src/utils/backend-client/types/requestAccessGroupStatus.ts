/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */

/**
 * The status of an Access Request.

 */
export type RequestAccessGroupStatus = typeof RequestAccessGroupStatus[keyof typeof RequestAccessGroupStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RequestAccessGroupStatus = {
  DECLINED: 'DECLINED',
  APPROVED: 'APPROVED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
} as const;