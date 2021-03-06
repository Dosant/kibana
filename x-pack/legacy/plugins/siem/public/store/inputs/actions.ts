/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Filter } from '@kbn/es-query';
import actionCreatorFactory from 'typescript-fsa';

import { SavedQuery } from 'src/legacy/core_plugins/data/public';
import { InspectQuery, Refetch } from './model';
import { InputsModelId } from './constants';

const actionCreator = actionCreatorFactory('x-pack/siem/local/inputs');

export const setAbsoluteRangeDatePicker = actionCreator<{
  id: InputsModelId;
  from: number;
  to: number;
}>('SET_ABSOLUTE_RANGE_DATE_PICKER');

export const setTimelineRangeDatePicker = actionCreator<{
  from: number;
  to: number;
}>('SET_TIMELINE_RANGE_DATE_PICKER');

export const setRelativeRangeDatePicker = actionCreator<{
  id: InputsModelId;
  fromStr: string;
  toStr: string;
  from: number;
  to: number;
}>('SET_RELATIVE_RANGE_DATE_PICKER');

export const setDuration = actionCreator<{ id: InputsModelId; duration: number }>('SET_DURATION');

export const startAutoReload = actionCreator<{ id: InputsModelId }>('START_KQL_AUTO_RELOAD');

export const stopAutoReload = actionCreator<{ id: InputsModelId }>('STOP_KQL_AUTO_RELOAD');

export const setQuery = actionCreator<{
  inputId: InputsModelId;
  id: string;
  loading: boolean;
  refetch: Refetch;
  inspect: InspectQuery | null;
}>('SET_QUERY');

export const deleteOneQuery = actionCreator<{
  inputId: InputsModelId;
  id: string;
}>('DELETE_QUERY');

export const setInspectionParameter = actionCreator<{
  id: string;
  inputId: InputsModelId;
  isInspected: boolean;
  selectedInspectIndex: number;
}>('SET_INSPECTION_PARAMETER');

export const deleteAllQuery = actionCreator<{ id: InputsModelId }>('DELETE_ALL_QUERY');

export const toggleTimelineLinkTo = actionCreator<{ linkToId: InputsModelId }>(
  'TOGGLE_TIMELINE_LINK_TO'
);

export const removeTimelineLinkTo = actionCreator('REMOVE_TIMELINE_LINK_TO');
export const addTimelineLinkTo = actionCreator<{ linkToId: InputsModelId }>('ADD_TIMELINE_LINK_TO');

export const removeGlobalLinkTo = actionCreator('REMOVE_GLOBAL_LINK_TO');
export const addGlobalLinkTo = actionCreator<{ linkToId: InputsModelId }>('ADD_GLOBAL_LINK_TO');

export const setFilterQuery = actionCreator<{
  id: InputsModelId;
  query: string | { [key: string]: unknown };
  language: string;
}>('SET_FILTER_QUERY');

export const setSavedQuery = actionCreator<{
  id: InputsModelId;
  savedQuery: SavedQuery | undefined;
}>('SET_SAVED_QUERY');

export const setSearchBarFilter = actionCreator<{
  id: InputsModelId;
  filters: Filter[];
}>('SET_SEARCH_BAR_FILTER');
