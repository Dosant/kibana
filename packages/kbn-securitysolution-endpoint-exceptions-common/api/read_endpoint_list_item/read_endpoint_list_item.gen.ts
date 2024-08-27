/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Read endpoint list item API endpoint
 *   version: 2023-10-31
 */

import { z } from '@kbn/zod';

import {
  ExceptionListItemId,
  ExceptionListItemHumanId,
} from '@kbn/securitysolution-exceptions-common/api/model/exception_list_common.gen';
import { EndpointListItem } from '../model/endpoint_list_common.gen';

export type ReadEndpointListItemRequestQuery = z.infer<typeof ReadEndpointListItemRequestQuery>;
export const ReadEndpointListItemRequestQuery = z.object({
  /**
   * Either `id` or `item_id` must be specified
   */
  id: ExceptionListItemId.optional(),
  /**
   * Either `id` or `item_id` must be specified
   */
  item_id: ExceptionListItemHumanId.optional(),
});
export type ReadEndpointListItemRequestQueryInput = z.input<
  typeof ReadEndpointListItemRequestQuery
>;

export type ReadEndpointListItemResponse = z.infer<typeof ReadEndpointListItemResponse>;
export const ReadEndpointListItemResponse = z.array(EndpointListItem);
