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

import moment from 'moment';
import { keys } from 'lodash';
import { TimefilterContract } from '../../timefilter';
import { RangeFilter, TimeRange } from '../../../../common';

export function convertRangeFilterToTimeRange(filter: RangeFilter) {
  const key = keys(filter.range)[0];
  const values = filter.range[key];

  const EPSILON = 1;

  return {
    from: values.gt ? moment(values.gt).add(EPSILON) : moment(values.gte),
    to: values.lt ? moment(values.lt).subtract(EPSILON) : moment(values.lte),
  };
}

export function convertRangeFilterToTimeRangeString(filter: RangeFilter): TimeRange {
  const { from, to } = convertRangeFilterToTimeRange(filter);
  return {
    from: from?.toISOString(),
    to: to?.toISOString(),
  };
}

export function changeTimeFilter(timeFilter: TimefilterContract, filter: RangeFilter) {
  timeFilter.setTime(convertRangeFilterToTimeRange(filter));
}
