/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */
import type { TargetGroupFrom } from './targetGroupFrom';
import type { TargetField } from './targetField';

export interface Target {
  id: string;
  targetGroupId: string;
  targetGroupFrom: TargetGroupFrom;
  fields: TargetField[];
}
