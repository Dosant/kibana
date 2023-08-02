/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { KibanaReactOverlays } from '@kbn/kibana-react-plugin/public';
import { ContentManagementPublicStart } from '@kbn/content-management-plugin/public';
import { SourceModal } from '../components/source_modal';
import { IndexPatternSavedObject } from '../types';

export function openSourceModal(
  {
    overlays,
    contentManagement,
  }: {
    overlays: KibanaReactOverlays;
    contentManagement: ContentManagementPublicStart;
  },
  onSelected: (indexPattern: IndexPatternSavedObject) => void
) {
  const modalRef = overlays.openModal(
    <SourceModal
      contentManagement={contentManagement}
      onIndexPatternSelected={(indexPattern) => {
        onSelected(indexPattern);
        modalRef.close();
      }}
    />
  );
}
