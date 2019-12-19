/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Plugin, CoreSetup, AppMountParameters } from 'kibana/public';

export class StateContainersExamplesPlugin implements Plugin {
  public setup(core: CoreSetup) {
    core.application.register({
      id: 'stateContainersExamples1',
      title: 'State containers examples 1',
      async mount(params: AppMountParameters) {
        const { renderApp } = await import('./app');
        return renderApp(params, '1');
      },
    });
    core.application.register({
      id: 'stateContainersExamples2',
      title: 'State containers examples 2',
      async mount(params: AppMountParameters) {
        const { renderApp } = await import('./app');
        return renderApp(params, '2');
      },
    });
  }

  public start() {}
  public stop() {}
}
