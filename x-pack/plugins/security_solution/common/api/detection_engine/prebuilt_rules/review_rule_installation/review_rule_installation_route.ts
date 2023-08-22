/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { RuleSignatureId, RuleTagArray, RuleVersion } from '../../model';
import type { DiffableRule } from '../model';

export interface ReviewRuleInstallationResponseBody {
  /** Aggregated info about all rules available for installation */
  stats: RuleInstallationStatsForReview;

  /** Info about individual rules: one object per each rule available for installation */
  rules: RuleInstallationInfoForReview[];
}

export interface RuleInstallationStatsForReview {
  /** Number of prebuilt rules available for installation */
  num_rules_to_install: number;

  /** A union of all tags of all rules available for installation */
  tags: RuleTagArray;
}

export type RuleInstallationInfoForReview = DiffableRule & {
  rule_id: RuleSignatureId;
  version: RuleVersion;
};
