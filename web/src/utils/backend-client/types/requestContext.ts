/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */
import type { RequestContextPurpose } from './requestContextPurpose';
import type { RequestContextContext } from './requestContextContext';
import type { RequestContextMetadata } from './requestContextMetadata';

export interface RequestContext {
  purpose: RequestContextPurpose;
  context: RequestContextContext;
  metadata: RequestContextMetadata;
}