/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

export const ADD_TO_NEW_CASE = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.addToNewCaseButton',
  {
    defaultMessage: 'Add to new case',
  }
);

export const CANCEL = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.cancelButton',
  {
    defaultMessage: 'Cancel',
  }
);

export const CHECK_ALL = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.checkAllButton',
  {
    defaultMessage: 'Check all',
  }
);

export const CHECKING = (index: string) =>
  i18n.translate('securitySolutionPackages.ecsDataQualityDashboard.checkingLabel', {
    values: { index },
    defaultMessage: 'Checking {index}',
  });

export const COLD_DESCRIPTION = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.coldDescription',
  {
    defaultMessage:
      'The index is no longer being updated and is queried infrequently. The information still needs to be searchable, but it’s okay if those queries are slower.',
  }
);

export const COPIED_RESULTS_TOAST_TITLE = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.toasts.copiedResultsToastTitle',
  {
    defaultMessage: 'Copied results to the clipboard',
  }
);

export const COPY_TO_CLIPBOARD = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.copyToClipboardButton',
  {
    defaultMessage: 'Copy to clipboard',
  }
);

export const DATA_QUALITY_PROMPT_CONTEXT_PILL = (indexName: string) =>
  i18n.translate('securitySolutionPackages.ecsDataQualityDashboard.dataQualityPromptContextPill', {
    values: { indexName },
    defaultMessage: 'Data Quality ({indexName})',
  });

export const DATA_QUALITY_PROMPT_CONTEXT_PILL_TOOLTIP = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.dataQualityPromptContextPillTooltip',
  {
    defaultMessage: 'Add this Data Quality report as context',
  }
);

/** The subtitle displayed on the Data Quality dashboard */
export const DATA_QUALITY_SUBTITLE: string = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.securitySolutionPackages.ecsDataQualityDashboardSubtitle',
  {
    defaultMessage: 'Check index mappings and values for compatibility with the',
  }
);

export const DATA_QUALITY_SUGGESTED_USER_PROMPT = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.dataQualitySuggestedUserPrompt',
  {
    defaultMessage:
      'Explain the results above, and describe some options to fix incompatibilities.',
  }
);

export const DATA_QUALITY_TITLE = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.securitySolutionPackages.ecsDataQualityDashboardTitle',
  {
    defaultMessage: 'Data quality',
  }
);

export const DEFAULT_PANEL_TITLE = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.defaultPanelTitle',
  {
    defaultMessage: 'Check index mappings',
  }
);

export const ECS_VERSION = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.ecsVersionStat',
  {
    defaultMessage: 'ECS version',
  }
);

export const ERROR_LOADING_ILM_EXPLAIN = (details: string) =>
  i18n.translate('securitySolutionPackages.ecsDataQualityDashboard.errorLoadingIlmExplainLabel', {
    values: { details },
    defaultMessage: 'Error loading ILM Explain: {details}',
  });

export const ERROR_LOADING_MAPPINGS = ({
  details,
  patternOrIndexName,
}: {
  details: string;
  patternOrIndexName: string;
}) =>
  i18n.translate('securitySolutionPackages.ecsDataQualityDashboard.errorLoadingMappingsLabel', {
    values: { details, patternOrIndexName },
    defaultMessage: 'Error loading mappings for {patternOrIndexName}: {details}',
  });

export const ERROR_LOADING_STATS = (details: string) =>
  i18n.translate('securitySolutionPackages.ecsDataQualityDashboard.errorLoadingStatsLabel', {
    values: { details },
    defaultMessage: 'Error loading stats: {details}',
  });

export const ERROR_LOADING_UNALLOWED_VALUES = ({
  details,
  indexName,
}: {
  details: string;
  indexName: string;
}) =>
  i18n.translate(
    'securitySolutionPackages.ecsDataQualityDashboard.errorLoadingUnallowedValuesLabel',
    {
      values: { details, indexName },
      defaultMessage: 'Error loading unallowed values for index {indexName}: {details}',
    }
  );

export const FIELDS = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.fieldsLabel',
  {
    defaultMessage: 'Fields',
  }
);

export const FROZEN_DESCRIPTION = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.frozenDescription',
  {
    defaultMessage: `The index is no longer being updated and is queried rarely. The information still needs to be searchable, but it's okay if those queries are extremely slow.`,
  }
);

export const HOT_DESCRIPTION = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.hotDescription',
  {
    defaultMessage: 'The index is actively being updated and queried',
  }
);

/** The tooltip for the `ILM phase` combo box on the Data Quality Dashboard */
export const INDEX_LIFECYCLE_MANAGEMENT_PHASES: string = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.indexLifecycleManagementPhasesTooltip',
  {
    defaultMessage:
      'Indices with these Index Lifecycle Management (ILM) phases will be checked for data quality',
  }
);

export const INDEX_NAME = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.indexNameLabel',
  {
    defaultMessage: 'Index name',
  }
);

/** The label displayed for the `ILM phase` combo box on the Data Quality dashboard */
export const ILM_PHASE: string = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.ilmPhaseLabel',
  {
    defaultMessage: 'ILM phase',
  }
);

export const LAST_CHECKED = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.lastCheckedLabel',
  {
    defaultMessage: 'Last checked',
  }
);

export const LOADING_ECS_METADATA = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.emptyLoadingPrompt.loadingEcsMetadataPrompt',
  {
    defaultMessage: 'Loading ECS metadata',
  }
);

export const SELECT_AN_INDEX = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.selectAnIndexPrompt',
  {
    defaultMessage: 'Select an index to compare it against ECS version',
  }
);

/** The placeholder for the `ILM phase` combo box on the Data Quality Dashboard */
export const SELECT_ONE_OR_MORE_ILM_PHASES: string = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.selectOneOrMorPhasesPlaceholder',
  {
    defaultMessage: 'Select one or more ILM phases',
  }
);

export const INDEX_SIZE_TOOLTIP = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.indexSizeTooltip',
  {
    defaultMessage: 'Size of index (exluding replicas)',
  }
);

export const TIMESTAMP_DESCRIPTION = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.timestampDescriptionLabel',
  {
    defaultMessage:
      'Date/time when the event originated. This is the date/time extracted from the event, typically representing when the event was generated by the source. If the event source has no original timestamp, this value is typically populated by the first time the event was received by the pipeline. Required field for all events.',
  }
);

export const UNMANAGED_DESCRIPTION = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.unmanagedDescription',
  {
    defaultMessage: `The index isn't managed by Index Lifecycle Management (ILM)`,
  }
);

export const WARM_DESCRIPTION = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.warmDescription',
  {
    defaultMessage: 'The index is no longer being updated but is still being queried',
  }
);

export const POST_RESULT_ERROR_TITLE = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.postResultErrorTitle',
  { defaultMessage: 'Error writing saved data quality check results' }
);

export const GET_RESULTS_ERROR_TITLE = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.getResultErrorTitle',
  { defaultMessage: 'Error reading saved data quality check results' }
);

export const COLD = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.ilmPhaseCold',
  {
    defaultMessage: 'cold',
  }
);

export const FROZEN = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.ilmPhaseFrozen',
  {
    defaultMessage: 'frozen',
  }
);

export const HOT = i18n.translate('securitySolutionPackages.ecsDataQualityDashboard.ilmPhaseHot', {
  defaultMessage: 'hot',
});

export const WARM = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.ilmPhaseWarm',
  {
    defaultMessage: 'warm',
  }
);

export const UNMANAGED = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.ilmPhaseUnmanaged',
  {
    defaultMessage: 'unmanaged',
  }
);

export const DATA_QUALITY_DASHBOARD_CONVERSATION_ID = i18n.translate(
  'securitySolutionPackages.ecsDataQualityDashboard.dataQualityDashboardConversationId',
  {
    defaultMessage: 'Data Quality dashboard',
  }
);
