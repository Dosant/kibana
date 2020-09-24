/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CoreSetup } from '../../../../../../src/core/server';
import { SetupPlugins } from '../../plugin';

import { Authentications } from '../authentications';
import { ElasticsearchAuthenticationAdapter } from '../authentications/elasticsearch_adapter';
import { ElasticsearchEventsAdapter, Events } from '../events';
import { KibanaBackendFrameworkAdapter } from '../framework/kibana_framework_adapter';
import { ElasticsearchHostsAdapter, Hosts } from '../hosts';
import { KpiHosts } from '../kpi_hosts';
import { ElasticsearchKpiHostsAdapter } from '../kpi_hosts/elasticsearch_adapter';

import { ElasticsearchIndexFieldAdapter, IndexFields } from '../index_fields';

import { KpiNetwork } from '../kpi_network';
import { ElasticsearchKpiNetworkAdapter } from '../kpi_network/elasticsearch_adapter';
import { ElasticsearchNetworkAdapter, Network } from '../network';
import { ElasticsearchSourceStatusAdapter, SourceStatus } from '../source_status';
import { ConfigurationSourcesAdapter, Sources } from '../sources';
import { AppBackendLibs, AppDomainLibs } from '../types';
import * as note from '../note/saved_object';
import * as pinnedEvent from '../pinned_event/saved_object';
import * as timeline from '../timeline/saved_object';
import { ElasticsearchMatrixHistogramAdapter, MatrixHistogram } from '../matrix_histogram';
import { EndpointAppContext } from '../../endpoint/types';

export function compose(
  core: CoreSetup,
  plugins: SetupPlugins,
  isProductionMode: boolean,
  endpointContext: EndpointAppContext
): AppBackendLibs {
  const framework = new KibanaBackendFrameworkAdapter(core, plugins, isProductionMode);
  const sources = new Sources(new ConfigurationSourcesAdapter());
  const sourceStatus = new SourceStatus(new ElasticsearchSourceStatusAdapter(framework));

  const domainLibs: AppDomainLibs = {
    authentications: new Authentications(new ElasticsearchAuthenticationAdapter(framework)),
    events: new Events(new ElasticsearchEventsAdapter(framework)),
    fields: new IndexFields(new ElasticsearchIndexFieldAdapter()),
    hosts: new Hosts(new ElasticsearchHostsAdapter(framework, endpointContext)),
    kpiHosts: new KpiHosts(new ElasticsearchKpiHostsAdapter(framework)),
    kpiNetwork: new KpiNetwork(new ElasticsearchKpiNetworkAdapter(framework)),
    matrixHistogram: new MatrixHistogram(new ElasticsearchMatrixHistogramAdapter(framework)),
    network: new Network(new ElasticsearchNetworkAdapter(framework)),
  };

  const libs: AppBackendLibs = {
    framework,
    sourceStatus,
    sources,
    ...domainLibs,
    timeline,
    note,
    pinnedEvent,
  };

  return libs;
}
