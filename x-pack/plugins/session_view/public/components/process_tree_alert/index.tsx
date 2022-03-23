/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect, useCallback } from 'react';
import { EuiBadge, EuiIcon, EuiText, EuiButtonIcon } from '@elastic/eui';
import { ProcessEvent, ProcessEventAlert } from '../../../common/types/process_tree';
import { getBadgeColorFromAlertStatus } from './helpers';
import { useStyles } from './styles';

export interface ProcessTreeAlertDeps {
  alert: ProcessEvent;
  isInvestigated: boolean;
  isSelected: boolean;
  onClick: (alert: ProcessEventAlert | null) => void;
  selectAlert: (alertUuid: string) => void;
  loadAlertDetails?: (alertUuid: string, handleOnAlertDetailsClosed: () => void) => void;
  handleOnAlertDetailsClosed: (alertUuid: string, status?: string) => void;
}

export const ProcessTreeAlert = ({
  alert,
  isInvestigated,
  isSelected,
  onClick,
  selectAlert,
  loadAlertDetails,
  handleOnAlertDetailsClosed,
}: ProcessTreeAlertDeps) => {
  const styles = useStyles({ isInvestigated, isSelected });

  const { uuid, rule, workflow_status: status } = alert.kibana?.alert || {};

  useEffect(() => {
    if (isInvestigated && uuid) {
      selectAlert(uuid);
    }
  }, [isInvestigated, uuid, selectAlert]);

  const handleExpandClick = useCallback(() => {
    if (loadAlertDetails && uuid) {
      loadAlertDetails(uuid, () => handleOnAlertDetailsClosed(uuid));
    }
  }, [handleOnAlertDetailsClosed, loadAlertDetails, uuid]);

  const handleClick = useCallback(() => {
    if (alert.kibana?.alert) {
      onClick(alert.kibana.alert);
    }
  }, [alert.kibana?.alert, onClick]);

  if (!(alert.kibana && rule)) {
    return null;
  }

  const { name } = rule;

  return (
    <EuiText
      key={uuid}
      size="s"
      css={styles.alert}
      data-id={uuid}
      data-test-subj={`sessionView:sessionViewAlertDetail-${uuid}`}
      onClick={handleClick}
    >
      <EuiButtonIcon
        iconType="expand"
        aria-label="expand"
        css={styles.alertRowItem}
        data-test-subj={`sessionView:sessionViewAlertDetailExpand-${uuid}`}
        onClick={handleExpandClick}
      />
      <EuiIcon type="alert" css={styles.alertRowItem} />
      <EuiText size="s" css={styles.alertRuleName}>
        {name}
      </EuiText>
      <EuiBadge color={getBadgeColorFromAlertStatus(status)} css={styles.alertStatus}>
        {status}
      </EuiBadge>
    </EuiText>
  );
};
