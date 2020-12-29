/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { BackgroundSessionStatus } from '../';

export enum ACTION {
  EXTEND = 'extend',
  CANCEL = 'cancel',
  DELETE = 'delete',
}

export const DATE_STRING_FORMAT = 'D MMM, YYYY, HH:mm:ss';

export { BackgroundSessionStatus as STATUS };
