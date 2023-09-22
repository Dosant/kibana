/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export { finishParamsSchema } from './schemas/latest';
export type {
  FinishMaintenanceWindowRequestParams,
  FinishMaintenanceWindowResponse,
} from './types/latest';

export { finishParamsSchema as finishParamsSchemaV1 } from './schemas/v1';
export type {
  FinishMaintenanceWindowRequestParams as FinishMaintenanceWindowRequestParamsV1,
  FinishMaintenanceWindowResponse as FinishMaintenanceWindowResponseV1,
} from './types/latest';
