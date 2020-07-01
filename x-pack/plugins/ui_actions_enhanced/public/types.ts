/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { KibanaReactOverlays } from '../../../../src/plugins/kibana_react/public';
import { ActionFactory } from './dynamic_actions';
import { TriggerId } from '../../../../src/plugins/ui_actions/public';

export interface CommonlyUsedRange {
  from: string;
  to: string;
  display: string;
}

export type OpenModal = KibanaReactOverlays['openModal'];

export type ActionFactoryRegistry = Map<string, ActionFactory>;
export type ActionFactoriesToTriggersRegistry = Map<string, TriggerId[]>;
