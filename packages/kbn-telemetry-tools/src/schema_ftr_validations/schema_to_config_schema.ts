/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { ObjectType, Type } from '@kbn/config-schema';
import { schema } from '@kbn/config-schema';
import { set } from '@kbn/safer-lodash-set';
import { get, merge } from 'lodash';
import type { AllowedSchemaTypes } from '@kbn/usage-collection-plugin/server';

/**
 * Type that defines all the possible values that the Telemetry Schema accepts.
 * These types definitions are helping to identify earlier the possible missing `properties` nesting when
 * manually defining the schemas.
 */
export type TelemetrySchemaValue =
  | {
      type: AllowedSchemaTypes | 'pass_through' | string;
    }
  | { type: 'array'; items: TelemetrySchemaValue }
  | TelemetrySchemaObject;

export interface TelemetrySchemaObject {
  properties: Record<string, TelemetrySchemaValue>;
}

function isOneOfCandidate(
  schemas: Array<Type<unknown>>
): schemas is [Type<unknown> | Type<unknown>] {
  return schemas.length === 2;
}

/**
 * Converts each telemetry schema value to the @kbn/config-schema equivalent
 * @param value
 */
function valueSchemaToConfigSchema(value: TelemetrySchemaValue): Type<unknown> {
  // We need to check the pass_through type on top of everything
  if ((value as { type: 'pass_through' }).type === 'pass_through') {
    return schema.any();
  }

  if ('properties' in value) {
    const { DYNAMIC_KEY, ...properties } = value.properties;
    const schemas: Array<Type<unknown>> = [objectSchemaToConfigSchema({ properties })];
    if (DYNAMIC_KEY) {
      schemas.push(schema.recordOf(schema.string(), valueSchemaToConfigSchema(DYNAMIC_KEY)));
    }
    return isOneOfCandidate(schemas) ? schema.oneOf(schemas) : schemas[0];
  } else {
    const valueType = value.type; // Copied in here because of TS reasons, it's not available in the `default` case
    switch (value.type) {
      case 'boolean':
        return schema.boolean();
      case 'keyword':
      case 'text':
      case 'date':
        // Some plugins return `null` when there is no value to report
        return schema.oneOf([schema.string(), schema.literal(null)]);
      case 'byte':
      case 'double':
      case 'float':
      case 'integer':
      case 'long':
      case 'short':
        // Some plugins return `null` when there is no number to report
        return schema.oneOf([schema.number(), schema.literal(null)]);
      case 'array':
        if ('items' in value) {
          return schema.arrayOf(valueSchemaToConfigSchema(value.items));
        }
      default:
        throw new Error(
          `Unsupported schema type ${valueType}. Did you forget to wrap your object definition in a nested 'properties' field?`
        );
    }
  }
}

function objectSchemaToConfigSchema(objectSchema: TelemetrySchemaObject): ObjectType {
  const objectEntries = Object.entries(objectSchema.properties);

  return schema.object(
    Object.fromEntries(
      objectEntries.map(([key, value]) => {
        try {
          return [key, schema.maybe(valueSchemaToConfigSchema(value))];
        } catch (err) {
          err.failedKey = [key, ...(err.failedKey || [])];
          throw err;
        }
      })
    )
  );
}

/**
 * Converts the JSON generated from the Usage Collection schema to a @kbn/config-schema object
 * so it can be used for validation. All entries are considered optional.
 * @param telemetrySchema JSON generated by @kbn/telemetry-tools from the Usage Collection schemas
 */
function convertSchemaToConfigSchema(telemetrySchema: {
  properties: Record<string, TelemetrySchemaValue>;
}): ObjectType {
  try {
    return objectSchemaToConfigSchema(telemetrySchema);
  } catch (err) {
    if (err.failedKey) {
      err.message = `Malformed schema for key [${err.failedKey.join('.')}]: ${err.message}`;
    }
    throw err;
  }
}

/**
 * Merges the telemetrySchema, generates a @kbn/config-schema version from it, and uses it to validate stats.
 * @param telemetrySchema The JSON schema definitions for root and plugins
 * @param stats The full output of the telemetry plugin
 */
export function assertTelemetryPayload(
  telemetrySchema: { root: TelemetrySchemaObject; plugins: TelemetrySchemaObject },
  stats: unknown
): void {
  const fullSchema = telemetrySchema.root;

  const mergedPluginsSchema = merge(
    {},
    get(fullSchema, 'properties.stack_stats.properties.kibana.properties.plugins'),
    telemetrySchema.plugins
  );

  set(
    fullSchema,
    'properties.stack_stats.properties.kibana.properties.plugins',
    mergedPluginsSchema
  );

  const ossTelemetryValidationSchema = convertSchemaToConfigSchema(fullSchema);

  // Run @kbn/config-schema validation to the entire payload
  try {
    ossTelemetryValidationSchema.validate(stats);
  } catch (err) {
    // "[path.to.key]: definition for this key is missing"
    const [, pathToKey] = err.message.match(/^\[(.*)\]\: definition for this key is missing/) ?? [];
    if (pathToKey) {
      err.message += `. Received \`${JSON.stringify(get(stats, pathToKey))}\``;
    }
    throw err;
  }
}
