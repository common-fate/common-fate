/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */

export interface TargetGroupDeployment {
  id?: string;
  functionArn?: string;
  awsAccount?: string;
  healthy?: boolean;
  diagnostics?: unknown[];
  activeConfig?: string;
  provider?: string;
}
