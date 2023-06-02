/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { InventoryItemType } from '../../../common/inventory_models/types';
import { InfraAssetMetricType } from '../../../common/http_api';

export type CloudProvider = 'gcp' | 'aws' | 'azure' | 'unknownProvider';
type HostMetrics = Record<InfraAssetMetricType, number | null>;

interface HostMetadata {
  os?: string | null;
  ip?: string | null;
  servicesOnHost?: number | null;
  title: { name: string; cloudProvider?: CloudProvider | null };
  id: string;
}
export type HostNodeRow = HostMetadata &
  HostMetrics & {
    name: string;
  };

export enum FlyoutTabIds {
  METADATA = 'metadata',
  PROCESSES = 'processes',
}

export type TabIds = `${FlyoutTabIds}`;

export interface TabState {
  metadata?: {
    query?: string;
    showActionsColumn?: boolean;
  };
  processes?: {
    query?: string;
  };
}

export interface FlyoutProps {
  closeFlyout: () => void;
  showInFlyout: true;
}

export interface FullPageProps {
  showInFlyout: false;
}

export type RenderMode = FlyoutProps | FullPageProps;

export interface Tab {
  id: FlyoutTabIds;
  name: string;
  'data-test-subj': string;
}

export interface AssetDetailsProps {
  node: HostNodeRow;
  nodeType: InventoryItemType;
  currentTimeRange: {
    interval: string;
    from: number;
    to: number;
  };
  tabs: Tab[];
  activeTabId?: TabIds;
  overrides?: TabState;
  renderMode?: RenderMode;
  onTabsStateChange?: TabsStateChangeFn;
  links?: Array<'uptime' | 'apmServices'>;
}

export type TabsStateChangeFn = (state: TabState & { activeTabId?: TabIds }) => void;
