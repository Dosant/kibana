/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from '@kbn/zod';
import { BooleanFromString } from '@kbn/zod-helpers';

export const deleteEntityDefinitionParamsSchema = z.object({
  id: z.string(),
});

export const deleteEntityDefinitionQuerySchema = z.object({
  deleteData: z.optional(BooleanFromString).default(false),
});

export type DeleteEntityDefinitionQuery = z.infer<typeof deleteEntityDefinitionQuerySchema>;
