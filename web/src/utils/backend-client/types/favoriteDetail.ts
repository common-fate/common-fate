/**
 * Generated by orval v6.9.6 🍺
 * Do not edit manually.
 * Approvals
 * Granted Approvals API
 * OpenAPI spec version: 1.0
 */
import type { CreateRequestWithSubRequest } from './createRequestWithSubRequest';
import type { RequestTiming } from './requestTiming';

export interface FavoriteDetail {
  id: string;
  name: string;
  with: CreateRequestWithSubRequest;
  reason?: string;
  timing: RequestTiming;
}
