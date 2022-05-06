/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  type Criteria,
  EuiEmptyPrompt,
  EuiBasicTable,
  EuiBasicTableProps,
  EuiBasicTableColumn,
} from '@elastic/eui';
import { SortDirection } from '@kbn/data-plugin/common';
import { EuiTableActionsColumnType } from '@elastic/eui/src/components/basic_table/table_types';
import { extractErrorMessage } from '../../../../common/utils/helpers';
import * as TEST_SUBJECTS from '../test_subjects';
import * as TEXT from '../translations';
import type { CspFinding } from '../types';
import type { FindingsGroupByNoneQuery, CspFindingsResult } from './use_latest_findings';
import { FindingsRuleFlyout } from '../findings_flyout/findings_flyout';
import { getExpandColumn, getFindingsColumns } from '../layout/findings_layout';

interface BaseFindingsTableProps extends FindingsGroupByNoneQuery {
  setQuery(query: Partial<FindingsGroupByNoneQuery>): void;
}

type FindingsTableProps = CspFindingsResult & BaseFindingsTableProps;

const FindingsTableComponent = ({
  setQuery,
  from,
  size,
  sort = [],
  error,
  data,
  loading,
}: FindingsTableProps) => {
  const [selectedFinding, setSelectedFinding] = useState<CspFinding>();

  const columns: [
    EuiTableActionsColumnType<CspFinding>,
    ...Array<EuiBasicTableColumn<CspFinding>>
  ] = useMemo(
    () => [getExpandColumn<CspFinding>({ onClick: setSelectedFinding }), ...getFindingsColumns()],
    []
  );

  const pagination = useMemo(
    () =>
      getEuiPaginationFromEsSearchSource({
        from,
        size,
        total: data?.total,
      }),
    [from, size, data]
  );

  const sorting = useMemo(() => getEuiSortFromEsSearchSource(sort), [sort]);

  const onTableChange = useCallback(
    (params: Criteria<CspFinding>) => {
      setQuery(getEsSearchQueryFromEuiTableParams(params));
    },
    [setQuery]
  );

  // Show "zero state"
  if (!loading && !data?.page.length)
    // TODO: use our own logo
    return (
      <EuiEmptyPrompt
        iconType="logoKibana"
        title={<h2>{TEXT.NO_FINDINGS}</h2>}
        data-test-subj={TEST_SUBJECTS.FINDINGS_TABLE_ZERO_STATE}
      />
    );

  return (
    <>
      <EuiBasicTable
        data-test-subj={TEST_SUBJECTS.FINDINGS_TABLE}
        loading={loading}
        error={error ? extractErrorMessage(error) : undefined}
        items={data?.page || []}
        columns={columns}
        pagination={pagination}
        sorting={sorting}
        onChange={onTableChange}
        hasActions
      />
      {selectedFinding && (
        <FindingsRuleFlyout
          findings={selectedFinding}
          onClose={() => setSelectedFinding(undefined)}
        />
      )}
    </>
  );
};

const getEuiPaginationFromEsSearchSource = ({
  from: pageIndex,
  size: pageSize,
  total,
}: Pick<FindingsTableProps, 'from' | 'size'> & {
  total: number | undefined;
}): EuiBasicTableProps<CspFinding>['pagination'] => ({
  pageSize,
  pageIndex: Math.ceil(pageIndex / pageSize),
  totalItemCount: total || 0,
  pageSizeOptions: [10, 25, 100],
  showPerPageOptions: true,
});

const getEuiSortFromEsSearchSource = (
  sort: FindingsGroupByNoneQuery['sort']
): EuiBasicTableProps<CspFinding>['sorting'] => {
  if (!sort.length) return;

  const entry = Object.entries(sort[0])?.[0];
  if (!entry) return;

  const [field, direction] = entry;
  return { sort: { field: field as keyof CspFinding, direction: direction as SortDirection } };
};

const getEsSearchQueryFromEuiTableParams = ({
  page,
  sort,
}: Criteria<CspFinding>): Partial<FindingsGroupByNoneQuery> => ({
  ...(!!page && { from: page.index * page.size, size: page.size }),
  sort: sort ? [{ [sort.field]: SortDirection[sort.direction] }] : undefined,
});

export const FindingsTable = React.memo(FindingsTableComponent);
