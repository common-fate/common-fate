/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */
import type { LogLevel } from './logLevel';

/**
 * A log entry.
 */
export interface Log {
  /** The log level. */
  level: LogLevel;
  /** The log message. */
  msg: string;
}
