/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import { schema } from '@kbn/config-schema';
import type { Logger, IRouter, ResponseError, CustomHttpResponseOptions } from '@kbn/core/server';
import type { FunctionHandler } from './function_handler';
import type { Context } from './types';

export function initRpcRoutes(
  router: IRouter,
  {
    wrapError,
    fnHandler,
    context: rpcContext,
  }: {
    logger: Logger;
    wrapError: (error: any) => CustomHttpResponseOptions<ResponseError>;
    fnHandler: FunctionHandler<Context>;
    context: Context;
  }
) {
  /**
   * @apiGroup ContentManagement
   *
   * @api {post} /content_management/rpc Execute RPC command
   * @apiName RPC
   */
  router.post(
    {
      path: '/api/content_management/rpc',
      validate: {
        body: schema.object({
          fn: schema.string(),
          arg: schema.object({}, { unknowns: 'allow' }),
        }),
      },
    },
    async (context, request, response) => {
      try {
        return response.ok({ body: await fnHandler.call(rpcContext, request.body) });
      } catch (e) {
        return response.customError(wrapError(e));
      }
    }
  );
}
