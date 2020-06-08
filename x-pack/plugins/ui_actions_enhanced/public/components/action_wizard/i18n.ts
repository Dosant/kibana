/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { i18n } from '@kbn/i18n';

export const txtChangeButton = i18n.translate(
  'xpack.uiActionsEnhanced.components.actionWizard.changeButton',
  {
    defaultMessage: 'Change',
  }
);

export const doesNotMeetLicenseRequirements = {
  header: i18n.translate('xpack.uiActionsEnhanced.components.actionWizard.noLicenseTooltipHeader', {
    defaultMessage: 'Not available',
  }),
  content: i18n.translate('xpack.uiActionsEnhanced.components.actionWizard.noLicenseTooltipBody', {
    defaultMessage: 'Upgrade your license to get access to this action.',
  }),
};
