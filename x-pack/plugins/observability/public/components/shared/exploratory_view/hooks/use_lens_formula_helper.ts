/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useMemo } from 'react';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { ObservabilityPublicPluginsStart, useFetcher } from '../../../..';

export const useLensFormulaHelper = () => {
  const {
    services: { lens },
  } = useKibana<ObservabilityPublicPluginsStart>();

  const { data: lensHelper } = useFetcher(async () => {
    return lens.stateHelperApi();
  }, [lens]);

  return useMemo(() => {
    if (lensHelper) {
      return lensHelper.formula;
    }
  }, [lensHelper]);
};
