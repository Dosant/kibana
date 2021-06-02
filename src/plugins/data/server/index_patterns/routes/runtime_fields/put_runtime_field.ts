/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { schema } from '@kbn/config-schema';
import { handleErrors } from '../util/handle_errors';
import { runtimeFieldSpecSchema } from '../util/schemas';
import { IRouter, StartServicesAccessor } from '../../../../../../core/server';
import type { DataPluginStart, DataPluginStartDependencies } from '../../../plugin';

export const registerPutRuntimeFieldRoute = (
  router: IRouter,
  getStartServices: StartServicesAccessor<DataPluginStartDependencies, DataPluginStart>
) => {
  router.put(
    {
      path: '/api/index_patterns/index_pattern/{id}/runtime_field',
      validate: {
        params: schema.object({
          id: schema.string({
            minLength: 1,
            maxLength: 1_000,
          }),
        }),
        body: schema.object({
          name: schema.string({
            minLength: 1,
            maxLength: 1_000,
          }),
          runtimeField: runtimeFieldSpecSchema,
          // TODO: extend this API to support `custom label`, `count` and `format`?
        }),
      },
    },
    handleErrors(async (ctx, req, res) => {
      const savedObjectsClient = ctx.core.savedObjects.client;
      const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
      const [, , { indexPatterns }] = await getStartServices();
      const indexPatternsService = await indexPatterns.indexPatternsServiceFactory(
        savedObjectsClient,
        elasticsearchClient
      );
      const id = req.params.id;
      const { name, runtimeField } = req.body;

      const indexPattern = await indexPatternsService.get(id);

      const oldFieldObject = indexPattern.fields.getByName(name);

      if (oldFieldObject && !oldFieldObject.runtimeField) {
        throw new Error('Only runtime fields can be updated');
      }

      if (oldFieldObject) {
        indexPattern.removeRuntimeField(name, {
          removeCustomLabel: false,
          removeFieldFormat: false,
        });
      }

      indexPattern.addRuntimeField(name, runtimeField);

      await indexPatternsService.updateSavedObject(indexPattern);

      const fieldObject = indexPattern.fields.getByName(name);
      if (!fieldObject) throw new Error(`Could not create a field [name = ${name}].`);

      return res.ok({
        body: {
          field: fieldObject.toSpec(),
          index_pattern: indexPattern.toSpec(),
        },
      });
    })
  );
};
