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

import { compareFilters, COMPARE_ALL_OPTIONS } from './compare_filters';
import { buildEmptyFilter, buildQueryFilter, FilterStateStore } from '../../es_query';

describe('filter manager utilities', () => {
  describe('compare filters', () => {
    test('should compare filters', () => {
      const f1 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index',
        ''
      );
      const f2 = buildEmptyFilter(true);

      expect(compareFilters(f1, f2)).toBeFalsy();
    });

    test('should compare duplicates', () => {
      const f1 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index',
        ''
      );
      const f2 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index',
        ''
      );

      expect(compareFilters(f1, f2)).toBeTruthy();
    });

    test('should compare filters, where one filter is null', () => {
      const f1 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index',
        ''
      );
      const f2 = null;
      expect(compareFilters(f1, f2 as any)).toBeFalsy();
    });

    test('should compare a null filter with an empty filter', () => {
      const f1 = null;
      const f2 = buildEmptyFilter(true);
      expect(compareFilters(f1 as any, f2)).toBeFalsy();
    });

    test('should compare duplicates, ignoring meta attributes', () => {
      const f1 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index1',
        ''
      );
      const f2 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index2',
        ''
      );

      expect(compareFilters(f1, f2)).toBeTruthy();
    });

    test('should compare duplicates, ignoring $state attributes', () => {
      const f1 = {
        $state: { store: FilterStateStore.APP_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };
      const f2 = {
        $state: { store: FilterStateStore.GLOBAL_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };

      expect(compareFilters(f1, f2)).toBeTruthy();
    });

    test('should compare filters array to non array', () => {
      const f1 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index',
        ''
      );

      const f2 = buildQueryFilter(
        { _type: { match: { query: 'mochi', type: 'phrase' } } },
        'index',
        ''
      );

      expect(compareFilters([f1, f2], f1)).toBeFalsy();
    });

    test('should compare filters array to partial array', () => {
      const f1 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index',
        ''
      );

      const f2 = buildQueryFilter(
        { _type: { match: { query: 'mochi', type: 'phrase' } } },
        'index',
        ''
      );

      expect(compareFilters([f1, f2], [f1])).toBeFalsy();
    });

    test('should compare filters array to exact array', () => {
      const f1 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index',
        ''
      );

      const f2 = buildQueryFilter(
        { _type: { match: { query: 'mochi', type: 'phrase' } } },
        'index',
        ''
      );

      expect(compareFilters([f1, f2], [f1, f2])).toBeTruthy();
    });

    test('should compare array of duplicates, ignoring meta attributes', () => {
      const f1 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index1',
        ''
      );
      const f2 = buildQueryFilter(
        { _type: { match: { query: 'apache', type: 'phrase' } } },
        'index2',
        ''
      );

      expect(compareFilters([f1], [f2])).toBeTruthy();
    });

    test('should compare array of duplicates, ignoring $state attributes', () => {
      const f1 = {
        $state: { store: FilterStateStore.APP_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };
      const f2 = {
        $state: { store: FilterStateStore.GLOBAL_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };

      expect(compareFilters([f1], [f2])).toBeTruthy();
    });

    test('should compare duplicates with COMPARE_ALL_OPTIONS should check store', () => {
      const f1 = {
        $state: { store: FilterStateStore.APP_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };
      const f2 = {
        $state: { store: FilterStateStore.GLOBAL_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };

      expect(compareFilters([f1], [f2], COMPARE_ALL_OPTIONS)).toBeFalsy();
    });

    test('should compare duplicates with COMPARE_ALL_OPTIONS should not check key and value ', () => {
      const f1 = {
        $state: { store: FilterStateStore.GLOBAL_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };
      const f2 = {
        $state: { store: FilterStateStore.GLOBAL_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };

      f2.meta.key = 'wassup';
      f2.meta.value = 'dog';

      expect(compareFilters([f1], [f2], COMPARE_ALL_OPTIONS)).toBeTruthy();
    });

    test('should compare alias with COMPARE_ALL_OPTIONS', () => {
      const f1 = {
        $state: { store: FilterStateStore.GLOBAL_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };
      const f2 = {
        $state: { store: FilterStateStore.GLOBAL_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };

      f2.meta.alias = 'wassup';
      f2.meta.alias = 'dog';

      expect(compareFilters([f1], [f2], COMPARE_ALL_OPTIONS)).toBeFalsy();
    });

    test('should compare duplicates, assuming $state: { store: FilterStateStore.APP_STATE } is default', () => {
      const f1 = {
        $state: { store: FilterStateStore.APP_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };
      const f2 = {
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };
      const f3 = {
        $state: { store: FilterStateStore.GLOBAL_STATE },
        ...buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
      };

      // don't take state into account at all:
      expect(compareFilters(f1, f2)).toBeTruthy();
      expect(compareFilters(f2, f3)).toBeTruthy();

      // compare with state, treat missing $state as APP_STATE:
      expect(compareFilters(f1, f2, { state: true })).toBeTruthy();
      expect(compareFilters(f2, f3, { state: true })).toBeFalsy();
    });
  });
});
