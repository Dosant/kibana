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

import { i18n } from '@kbn/i18n';
import { TutorialsCategory } from '../../services/tutorials';
import {
  onPremInstructions,
  cloudInstructions,
  onPremCloudInstructions,
} from '../instructions/filebeat_instructions';
import {
  TutorialContext,
  TutorialSchema,
} from '../../services/tutorials/lib/tutorials_registry_types';

export function gsuiteLogsSpecProvider(context: TutorialContext): TutorialSchema {
  const moduleName = 'gsuite';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'] as const;
  return {
    id: 'gsuiteLogs',
    name: i18n.translate('home.tutorials.gsuiteLogs.nameTitle', {
      defaultMessage: 'GSuite logs',
    }),
    moduleName,
    category: TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: i18n.translate('home.tutorials.gsuiteLogs.shortDescription', {
      defaultMessage: 'Collect GSuite activity reports.',
    }),
    longDescription: i18n.translate('home.tutorials.gsuiteLogs.longDescription', {
      defaultMessage:
        'This is a module for ingesting data from the different GSuite audit reports APIs. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-gsuite.html',
      },
    }),
    euiIconType: 'logoGoogleG',
    artifacts: {
      dashboards: [],
      application: {
        path: '/app/security',
        label: i18n.translate('home.tutorials.gsuiteLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Security App',
        }),
      },
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-gsuite.html',
      },
    },
    completionTimeMinutes: 10,
    onPrem: onPremInstructions(moduleName, platforms, context),
    elasticCloud: cloudInstructions(moduleName, platforms),
    onPremElasticCloud: onPremCloudInstructions(moduleName, platforms),
  };
}
