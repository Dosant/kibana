/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { CoreSetup } from '@kbn/core-lifecycle-server';
import type { Logger } from '@kbn/logging';
import type { UsageCollectionSetup } from '@kbn/usage-collection-plugin/server';
import type { estypes } from '@elastic/elasticsearch';
import { favoritesSavedObjectName } from './favorites_saved_object';

interface FavoritesUsage {
  [favorite_object_type: string]: {
    total: number;
    avg_per_user_per_space: number;
    max_per_user_per_space: number;
  };
}

export function registerFavoritesUsageCollection({
  core,
  logger,
  usageCollection,
}: {
  core: CoreSetup;
  logger: Logger;
  usageCollection: UsageCollectionSetup;
}) {
  usageCollection.registerCollector(
    usageCollection.makeUsageCollector<FavoritesUsage>({
      type: 'favorites',
      isReady: () => true,
      schema: {
        DYNAMIC_KEY /* e.g. 'dashboard' */: {
          total: {
            type: 'long',
            _meta: { description: 'Total favorite object count in this deployment' },
          },
          avg_per_user_per_space: {
            type: 'double',
            _meta: {
              description:
                'Average favorite objects count of this type per user per space for this deployment, only counts users who have favorited at least one object of this type',
            },
          },
          max_per_user_per_space: {
            type: 'long',
            _meta: {
              description:
                'Max favorite objects count of this type per user per space for this deployment',
            },
          },
        },
      },
      fetch: async (context) => {
        const favoritesIndex = await core
          .getStartServices()
          .then(([{ savedObjects }]) => savedObjects.getIndexForType(favoritesSavedObjectName));

        const response = await context.esClient.search<
          unknown,
          { types: estypes.AggregationsStringTermsAggregate }
        >({
          index: favoritesIndex,
          size: 0,
          _source: false,
          filter_path: ['aggregations'],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    type: 'favorites',
                  },
                },
              ],
            },
          },
          runtime_mappings: {
            number_of_favorites: {
              type: 'long',
              script: {
                source: "emit(doc['favorites.favoriteIds'].length)",
              },
            },
          },
          aggs: {
            types: {
              terms: {
                field: 'favorites.type',
              },
              aggs: {
                total: {
                  sum: {
                    field: 'number_of_favorites',
                  },
                },
                avg: {
                  avg: {
                    field: 'number_of_favorites',
                  },
                },
                max: {
                  max: {
                    field: 'number_of_favorites',
                  },
                },
              },
            },
          },
        });

        const favoritesUsage: FavoritesUsage = {};

        const typesBuckets =
          (response.aggregations?.types?.buckets as estypes.AggregationsStringTermsBucket[]) ?? [];

        typesBuckets.forEach((bucket) => {
          favoritesUsage[bucket.key] = {
            total: bucket.total.value,
            avg_per_user_per_space: bucket.avg.value,
            max_per_user_per_space: bucket.max.value,
          };
        });

        return favoritesUsage;
      },
    })
  );
}
