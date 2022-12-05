/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { FileImage } from '@kbn/shared-ux-file-image';
import classNames from 'classnames';
import {
  EuiButtonIcon,
  EuiEmptyPrompt,
  EuiImage,
  useEuiTheme,
  useResizeObserver,
  EuiImageProps,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n-react';
import { ImageConfig } from '../types';
import notFound from './not_found/not_found_light.png';
import notFound2x from './not_found/not_found_light@2x.png';
import { validateImageConfig } from '../utils/validate_image_config';
import { createValidateUrl } from '../utils/validate_url';

export interface ImageViewerContextValue {
  getImageDownloadHref: (fileId: string) => string;
  validateUrl: ReturnType<typeof createValidateUrl>;
}

export const ImageViewerContext = createContext<ImageViewerContextValue>(
  null as unknown as ImageViewerContextValue
);

const useImageViewerContext = () => {
  const ctx = useContext(ImageViewerContext);
  if (!ctx) {
    throw new Error('ImageViewerContext is not found!');
  }
  return ctx;
};

export function ImageViewer({
  imageConfig,
  onChange,
  onClear,
  onError,
  className,
  containerCSS,
}: {
  imageConfig: ImageConfig;
  className?: string;
  onChange?: () => void;
  onClear?: () => void;
  onError?: () => void;
  containerCSS?: SerializedStyles;
}) {
  const { euiTheme } = useEuiTheme();
  const { getImageDownloadHref, validateUrl } = useImageViewerContext();

  const isImageConfigValid = validateImageConfig(imageConfig, { validateUrl });

  const src =
    imageConfig.src.type === 'url'
      ? imageConfig.src.url
      : getImageDownloadHref(imageConfig.src.fileId);

  const [hasFailedToLoad, setFailedToLoad] = useState<boolean>(false);

  useEffect(() => {
    setFailedToLoad(false);
  }, [src]);

  return (
    <div
      css={[
        css`
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: ${euiTheme.border.radius.medium};

          .visually-hidden {
            visibility: hidden;
          }
        `,
        containerCSS,
      ]}
    >
      {(hasFailedToLoad || !isImageConfigValid) && <NotFound />}
      {isImageConfigValid && (
        <FileImage
          src={src}
          meta={imageConfig.src.type === 'file' ? imageConfig.src.fileImageMeta : undefined}
          alt={imageConfig.altText ?? ''}
          className={classNames(className, { 'visually-hidden': hasFailedToLoad })}
          title={onChange ? 'Click to select a different image' : undefined}
          style={{
            width: '100%',
            height: '100%',
            objectFit: imageConfig?.sizing?.objectFit ?? 'contain',
            cursor: onChange ? 'pointer' : 'initial',
            display: 'block', // needed to remove gap under the image
            backgroundColor: imageConfig.backgroundColor,
          }}
          wrapperProps={{
            style: { display: 'block', height: '100%', width: '100%' },
          }}
          onClick={() => {
            if (onChange) onChange();
          }}
          onError={() => {
            setFailedToLoad(true);
            if (onError) onError();
          }}
        />
      )}
      {onClear && (
        <EuiButtonIcon
          style={{ position: 'absolute', top: '-4px', right: '-4px' }}
          display="fill"
          iconType="cross"
          aria-label="Clear"
          color="danger"
          onClick={() => {
            if (onClear) onClear();
          }}
        />
      )}
    </div>
  );
}

function NotFound() {
  const [resizeRef, setRef] = React.useState<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(resizeRef);
  let mode: 'none' | 'only-image' | 'image-and-text' = 'none';
  if (!resizeRef) {
    mode = 'none';
  } else if (dimensions.height > 300 && dimensions.width > 300) {
    mode = 'image-and-text';
  } else {
    mode = 'only-image';
  }

  return (
    <div
      ref={(node) => setRef(node)}
      css={`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .euiPanel,
        .euiEmptyPrompt__main {
          height: 100%;
          width: 100%;
          max-width: none;
        }
      `}
    >
      {mode === 'only-image' && (
        <NotFoundImage
          css={`
            object-fit: contain;
            height: 100%;
            width: 100%;
          `}
          wrapperProps={{
            css: `
              height: 100%;
              width: 100%;
            `,
          }}
        />
      )}
      {mode === 'image-and-text' && (
        <EuiEmptyPrompt
          color="transparent"
          icon={<NotFoundImage />}
          title={
            <p>
              <FormattedMessage
                id="imageEmbeddable.imageViewer.notFoundTitle"
                defaultMessage="Image not found"
              />
            </p>
          }
          layout="horizontal"
          body={
            <p>
              <FormattedMessage
                id="imageEmbeddable.imageViewer.notFoundMessage"
                defaultMessage="Sorry, we can't find the image you are looking for. It might have been
              removed or renamed, or maybe it never existed."
              />
            </p>
          }
        />
      )}
    </div>
  );
}

const NotFoundImage = React.memo((props: Partial<Omit<EuiImageProps, 'url'>>) => (
  <EuiImage
    {...props}
    srcSet={`${notFound} 1x, ${notFound2x} 2x`}
    src={notFound}
    alt={i18n.translate('imageEmbeddable.imageViewer.notFoundImageAltText', {
      defaultMessage: `An outer space illustration. In the background is a large moon and two planets. In the foreground is an astronaut floating in space and the numbers '404'.`,
    })}
  />
));
