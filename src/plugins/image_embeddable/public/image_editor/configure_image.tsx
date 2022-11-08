/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { toMountPoint } from '@kbn/kibana-react-plugin/public';
import { FilesContext } from '@kbn/files-plugin/public';
import { skip, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ImageConfig } from '../types';
import { ImageEditorFlyout } from './image_editor_flyout';
import { ImageViewerContext } from '../image_viewer';
import { OverlayStart, ApplicationStart, FilesClient, FileImageMetadata } from '../imports';

/**
 * @throws in case user cancels
 */
export async function configureImage(
  deps: {
    files: FilesClient<FileImageMetadata>;
    overlays: OverlayStart;
    currentAppId$: ApplicationStart['currentAppId$'];
  },
  initialImageConfig?: ImageConfig
): Promise<ImageConfig> {
  return new Promise((resolve, reject) => {
    const closed$ = new Subject<true>();

    const onSave = (imageConfig: ImageConfig) => {
      resolve(imageConfig);
      handle.close();
    };

    const onCancel = () => {
      reject();
      handle.close();
    };

    // Close the flyout on application change.
    deps.currentAppId$.pipe(takeUntil(closed$), skip(1), take(1)).subscribe(() => {
      handle.close();
    });

    const handle = deps.overlays.openFlyout(
      toMountPoint(
        <FilesContext client={deps.files}>
          <ImageViewerContext.Provider
            value={{
              filesClient: deps.files,
            }}
          >
            <ImageEditorFlyout
              onCancel={onCancel}
              onSave={onSave}
              initialImageConfig={initialImageConfig}
            />
          </ImageViewerContext.Provider>
        </FilesContext>
      ),
      {
        ownFocus: true,
        'data-test-subj': 'createImageEmbeddableFlyout',
      }
    );

    handle.onClose.then(() => {
      closed$.next(true);
    });
  });
}
