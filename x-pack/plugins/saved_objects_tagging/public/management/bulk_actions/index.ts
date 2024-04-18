/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { TagsCapabilities } from '../../../common';
import { ITagInternalClient, ITagAssignmentService, ITagsCache } from '../../services';
import { StartServices } from '../../types';
import { TagBulkAction } from '../types';
import { getBulkDeleteAction } from './bulk_delete';
import { getBulkAssignAction } from './bulk_assign';
import { getClearSelectionAction } from './clear_selection';

interface GetBulkActionOptions {
  startServices: StartServices;
  capabilities: TagsCapabilities;
  tagClient: ITagInternalClient;
  tagCache: ITagsCache;
  assignmentService: ITagAssignmentService;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  assignableTypes: string[];
}

export const getBulkActions = ({
  startServices,
  capabilities,
  tagClient,
  tagCache,
  assignmentService,
  clearSelection,
  setLoading,
  assignableTypes,
}: GetBulkActionOptions): TagBulkAction[] => {
  const actions: TagBulkAction[] = [];

  if (capabilities.assign && assignableTypes.length > 0) {
    actions.push(
      getBulkAssignAction({
        ...startServices,
        tagCache,
        assignmentService,
        assignableTypes,
        setLoading,
      })
    );
  }
  if (capabilities.delete) {
    actions.push(getBulkDeleteAction({ ...startServices, tagClient, setLoading }));
  }

  // only add clear selection if user has permission to perform any other action
  // as having at least one action will show the bulk action menu, and the selection column on the table
  // and we want to avoid doing that only for the 'unselect' action.
  if (actions.length > 0) {
    actions.push(getClearSelectionAction({ clearSelection }));
  }

  return actions;
};
