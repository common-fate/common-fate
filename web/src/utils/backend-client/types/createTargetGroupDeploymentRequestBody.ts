/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */

export type CreateTargetGroupDeploymentRequestBody = {
  /** The ID of the target group to deploy to. User, provided */
  id: string;
  functionArn: string;
  runtime: string;
  awsAccount: string;
  awsRegion: string;
};