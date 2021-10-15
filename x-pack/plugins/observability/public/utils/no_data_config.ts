/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import type { KibanaPageTemplateProps } from '@kbn/react-page-template';
import { IBasePath } from '../../../../../src/core/public';

export function getNoDataConfig({
  docsLink,
  basePath,
  hasData,
  isDarkMode,
}: {
  docsLink: string;
  isDarkMode: boolean;
  basePath: IBasePath;
  hasData?: boolean;
}): KibanaPageTemplateProps['noDataConfig'] {
  if (hasData === false) {
    return {
      solution: i18n.translate('xpack.observability.noDataConfig.solutionName', {
        defaultMessage: 'Observability',
      }),
      actions: {
        beats: {
          description: i18n.translate('xpack.observability.noDataConfig.beatsCard.description', {
            defaultMessage:
              'Use Beats and APM agents to send observability data to Elasticsearch. We make it easy with support for many popular systems, apps, and languages.',
          }),
          href: basePath.prepend(`/app/home#/tutorial_directory/logging`),
        },
      },
      docsLink,
      addBasePath: basePath.prepend,
      isDarkMode,
    };
  }
}
