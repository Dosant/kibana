/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CoreStart, CoreSetup, Plugin, PluginInitializerContext } from 'src/core/public';
import { UiActionsSetup, UiActionsStart } from '../../../../src/plugins/ui_actions/public';
import { SharePluginStart, SharePluginSetup } from '../../../../src/plugins/share/public';
import { DashboardDrilldownsService } from './services';
import { DataPublicPluginStart } from '../../../../src/plugins/data/public';
import { DrilldownsSetup, DrilldownsStart } from '../../drilldowns/public';

export interface SetupDependencies {
  uiActions: UiActionsSetup;
  drilldowns: DrilldownsSetup;
  share: SharePluginSetup;
}

export interface StartDependencies {
  uiActions: UiActionsStart;
  drilldowns: DrilldownsStart;
  share: SharePluginStart;
  data: DataPublicPluginStart;
}

// eslint-disable-next-line
export interface SetupContract {}

// eslint-disable-next-line
export interface StartContract {}

export class DashboardEnhancedPlugin
  implements Plugin<SetupContract, StartContract, SetupDependencies, StartDependencies> {
  public readonly drilldowns = new DashboardDrilldownsService();
  public readonly config: { drilldowns: { enabled: boolean } };

  constructor(protected readonly context: PluginInitializerContext) {
    this.config = context.config.get();
  }

  public setup(core: CoreSetup<StartDependencies>, plugins: SetupDependencies): SetupContract {
    this.drilldowns.bootstrap(core, plugins, {
      enableDrilldowns: this.config.drilldowns.enabled,
    });

    return {};
  }

  public start(core: CoreStart, plugins: StartDependencies): StartContract {
    return {};
  }

  public stop() {}
}
