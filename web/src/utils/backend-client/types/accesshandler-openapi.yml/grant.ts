/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Approvals
 * Granted Approvals API
 * OpenAPI spec version: 1.0
 */
import type { GrantStatus } from './grantStatus';
import type { GrantWith } from './grantWith';

/**
 * A temporary assignment of a user to a principal.
 */
export interface Grant {
  id: string;
  /** The current state of the grant. */
  status: GrantStatus;
  /** The email address of the user to grant access to. */
  subject: string;
  /** The ID of the provider to grant access to. */
  provider: string;
  /** Provider-specific grant data. Must match the provider's schema. */
  with: GrantWith;
  /** The start time of the grant in ISO8601 format. */
  start: string;
  /** The end time of the grant in ISO8601 format. */
  end: string;
}
