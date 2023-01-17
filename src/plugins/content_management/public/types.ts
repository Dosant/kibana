/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ContentClient } from './content_client';
import { ContentRegistry } from './registry';

export interface ContentManagementPublicSetup {
  registry: ContentRegistry;
}

export interface ContentManagementPublicStart {
  client: ContentClient;
  registry: ContentRegistry;
}
