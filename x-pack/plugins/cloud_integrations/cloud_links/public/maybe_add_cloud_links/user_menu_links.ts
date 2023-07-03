/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import type { CloudStart } from '@kbn/cloud-plugin/public';
import type { UserMenuLink } from '@kbn/security-plugin/public';

export const createUserMenuLinks = (cloud: CloudStart): UserMenuLink[] => {
  const { profileUrl, billingUrl, organizationUrl } = cloud;

  const userMenuLinks = [] as UserMenuLink[];

  if (profileUrl) {
    userMenuLinks.push({
      label: i18n.translate('xpack.cloudLinks.userMenuLinks.profileLinkText', {
        defaultMessage: 'Profile',
      }),
      iconType: 'user',
      href: profileUrl,
      order: 100,
      setAsProfile: true,
    });
  }

  if (billingUrl) {
    userMenuLinks.push({
      label: i18n.translate('xpack.cloudLinks.userMenuLinks.billingLinkText', {
        defaultMessage: 'Billing',
      }),
      iconType: 'visGauge',
      href: billingUrl,
      order: 200,
    });
  }

  if (organizationUrl) {
    userMenuLinks.push({
      label: i18n.translate('xpack.cloudLinks.userMenuLinks.organizationLinkText', {
        defaultMessage: 'Organization',
      }),
      iconType: 'gear',
      href: organizationUrl,
      order: 300,
    });
  }

  return userMenuLinks;
};
