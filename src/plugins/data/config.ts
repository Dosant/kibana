/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { schema, TypeOf } from '@kbn/config-schema';

export const searchSessionsConfigSchema = schema.object({
  /**
   * Turns the feature on \ off (incl. removing indicator and management screens)
   */
  enabled: schema.boolean({ defaultValue: true }),
  /**
   * pageSize controls how many search session objects we load at once while monitoring
   * session completion
   */
  pageSize: schema.number({ defaultValue: 100 }),

  /**
   * notTouchedTimeout controls how long user can save a session after all searches completed.
   * The client continues to poll searches to keep the alive until this timeout hits
   */
  notTouchedTimeout: schema.duration({ defaultValue: '5m' }),

  /**
   * maxUpdateRetries controls how many retries we perform while attempting to save a search session
   */
  maxUpdateRetries: schema.number({ defaultValue: 3 }),

  /**
   * defaultExpiration controls how long search sessions are valid for, until they are expired.
   */
  defaultExpiration: schema.duration({ defaultValue: '7d' }),
  management: schema.object({
    /**
     * maxSessions controls how many saved search sessions we load on the management screen.
     */
    maxSessions: schema.number({ defaultValue: 100 }),
    /**
     * refreshInterval controls how often we refresh the management screen. 0s as duration means that auto-refresh is turned off.
     */
    refreshInterval: schema.duration({ defaultValue: '0s' }),
    /**
     * refreshTimeout controls the timeout for loading search sessions on mgmt screen
     */
    refreshTimeout: schema.duration({ defaultValue: '1m' }),
    expiresSoonWarning: schema.duration({ defaultValue: '1d' }),
  }),
});

export const configSchema = schema.object({
  search: schema.object({
    aggs: schema.object({
      shardDelay: schema.object({
        // Whether or not to register the shard_delay (which is only available in snapshot versions
        // of Elasticsearch) agg type/expression function to make it available in the UI for either
        // functional or manual testing
        enabled: schema.boolean({ defaultValue: false }),
      }),
    }),
    sessions: searchSessionsConfigSchema,
  }),
});

export type ConfigSchema = TypeOf<typeof configSchema>;

export type SearchSessionsConfigSchema = TypeOf<typeof searchSessionsConfigSchema>;
