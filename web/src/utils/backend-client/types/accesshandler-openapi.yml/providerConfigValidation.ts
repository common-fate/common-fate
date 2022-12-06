/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */
import type { ProviderConfigValidationStatus } from './providerConfigValidationStatus';
import type { Log } from '../accesshandler-openapi.yml/log';

/**
 * A validation against the configuration values of the Access Provider.
 */
export interface ProviderConfigValidation {
  /** The ID of the validation, such as `list-sso-users`. */
  id: string;
  name: string;
  /** The status of the validation. */
  status: ProviderConfigValidationStatus;
  /** The particular config fields validated, if any. */
  fieldsValidated: string[];
  logs: Log[];
}
