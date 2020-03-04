/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

/* eslint-disable no-console */

import * as React from 'react';
import { EuiFlyout } from '@elastic/eui';
import { storiesOf } from '@storybook/react';
import { FlyoutDrilldownWizard } from '.';
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
import { UrlDrilldownActionFactory } from '../../../../advanced_ui_actions/public/components/action_wizard/test_data';
import {
  ActionFactoryBaseConfig,
  ActionFactory,
} from '../../../../../../src/plugins/ui_actions/public/';

storiesOf('components/FlyoutDrilldownWizard', module)
  .add('default', () => {
    return <FlyoutDrilldownWizard context={{} as any} />;
  })
  .add('open in flyout - create', () => {
    return (
      <EuiFlyout onClose={() => {}}>
        <FlyoutDrilldownWizard context={{} as any} onClose={() => {}} />
      </EuiFlyout>
    );
  })
  .add('open in flyout - edit', () => {
    return (
      <EuiFlyout onClose={() => {}}>
        <FlyoutDrilldownWizard
          context={{} as any}
          onClose={() => {}}
          initialDrilldownWizardConfig={{
            name: 'My fancy drilldown',
            actionConfig: {
              actionFactory: (UrlDrilldownActionFactory as unknown) as ActionFactory,
              config: {
                url: 'https://elastic.co',
                openInNewTab: true,
              } as ActionFactoryBaseConfig,
            },
          }}
          mode={'edit'}
        />
      </EuiFlyout>
    );
  });
