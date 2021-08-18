/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ElasticsearchClient, SavedObjectsClientContract } from '../../../../core/server';
import { IndexPatternSavedObjectAttrs } from '../../common/index_patterns/index_patterns';
import { KNOWN_FLEET_ASSETS } from '../../common/index_patterns/constants';

interface Deps {
  esClient: ElasticsearchClient;
  soClient: SavedObjectsClientContract;
}

export const hasIndexPatternWithUserData = async ({
  esClient,
  soClient,
}: Deps): Promise<boolean> => {
  const indexPatterns = await soClient.find<IndexPatternSavedObjectAttrs>({
    type: 'index-pattern',
    fields: ['title'],
    search: `*`,
    searchFields: ['title'],
    perPage: 100,
  });

  // If there are no index patterns, assume this is a new instance
  if (indexPatterns.total === 0) {
    return false;
  }

  // If there are any index patterns that are not the default metrics-* and logs-* ones created by Fleet, assume this
  // is not a new instance
  if (
    indexPatterns.saved_objects.some(
      (ip) =>
        ip.attributes.title !== KNOWN_FLEET_ASSETS.METRICS_INDEX_PATTERN &&
        ip.attributes.title !== KNOWN_FLEET_ASSETS.LOGS_INDEX_PATTERN
    )
  ) {
    return true;
  }

  try {
    const logsAndMetricsIndices = await esClient.cat.indices({
      index: `${KNOWN_FLEET_ASSETS.METRICS_INDEX_PATTERN},${KNOWN_FLEET_ASSETS.LOGS_INDEX_PATTERN}`,
      format: 'json',
    });

    const anyIndicesContainingUserData = logsAndMetricsIndices.body
      // Ignore some data that is shipped by default
      .filter(
        ({ index }) =>
          !KNOWN_FLEET_ASSETS.INDEX_PREFIXES_TO_IGNORE.some((prefix) => index?.startsWith(prefix))
      )
      // If any other logs and metrics indices have data, return true
      .some((catResult) => Number(catResult['docs.count'] ?? '0') > 0);

    return anyIndicesContainingUserData;
  } catch (e) {
    // If any errors are encountered return true to be safe
    return true;
  }
};
