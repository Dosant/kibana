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

import _ from 'lodash';
import './index_header';
import './create_edit_field';
import { docTitle } from 'ui/doc_title';
import { KbnUrlProvider } from 'ui/url';
import { IndicesEditSectionsProvider } from './edit_sections';
import { fatalError, toastNotifications } from 'ui/notify';
import uiRoutes from 'ui/routes';
import { uiModules } from 'ui/modules';
import template from './edit_index_pattern.html';
import { fieldWildcardMatcher } from 'ui/field_wildcard';
import { IndexPatternListFactory } from 'ui/management/index_pattern_list';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { SourceFiltersTable } from './source_filters_table';
import { IndexedFieldsTable } from './indexed_fields_table';
import { ScriptedFieldsTable } from './scripted_fields_table';
import { i18n } from '@kbn/i18n';
import { I18nContext } from 'ui/i18n';

import { getEditBreadcrumbs } from '../breadcrumbs';

import { createStore, syncState } from '../../../../../../../../plugins/kibana_utils/public';

const REACT_SOURCE_FILTERS_DOM_ELEMENT_ID = 'reactSourceFiltersTable';
const REACT_INDEXED_FIELDS_DOM_ELEMENT_ID = 'reactIndexedFieldsTable';
const REACT_SCRIPTED_FIELDS_DOM_ELEMENT_ID = 'reactScriptedFieldsTable';

function updateSourceFiltersTable($scope) {
  $scope.$$postDigest(() => {
    const node = document.getElementById(REACT_SOURCE_FILTERS_DOM_ELEMENT_ID);
    if (!node) {
      return;
    }

    render(
      <I18nContext>
        <SourceFiltersTable
          indexPattern={$scope.indexPattern}
          filterFilter={$scope.fieldFilter}
          fieldWildcardMatcher={$scope.fieldWildcardMatcher}
          onAddOrRemoveFilter={() => {
            $scope.editSections = $scope.editSectionsProvider($scope.indexPattern, $scope.fieldFilter, $scope.indexPatternListProvider);
            $scope.refreshFilters();
            $scope.$apply();
          }}
        />
      </I18nContext>,
      node,
    );
  });
}

function destroySourceFiltersTable() {
  const node = document.getElementById(REACT_SOURCE_FILTERS_DOM_ELEMENT_ID);
  node && unmountComponentAtNode(node);
}


function updateScriptedFieldsTable($scope) {
  $scope.$$postDigest(() => {
    const node = document.getElementById(REACT_SCRIPTED_FIELDS_DOM_ELEMENT_ID);
    if (!node) {
      return;
    }

    render(
      <I18nContext>
        <ScriptedFieldsTable
          indexPattern={$scope.indexPattern}
          fieldFilter={$scope.fieldFilter}
          scriptedFieldLanguageFilter={$scope.scriptedFieldLanguageFilter}
          helpers={{
            redirectToRoute: (obj, route) => {
              $scope.kbnUrl.redirectToRoute(obj, route);
              $scope.$apply();
            },
            getRouteHref: (obj, route) => $scope.kbnUrl.getRouteHref(obj, route),
          }}
          onRemoveField={() => {
            $scope.editSections = $scope.editSectionsProvider($scope.indexPattern, $scope.fieldFilter, $scope.indexPatternListProvider);
            $scope.refreshFilters();
            $scope.$apply();
          }}
        />
      </I18nContext>,
      node,
    );
  });
}

function destroyScriptedFieldsTable() {
  const node = document.getElementById(REACT_SCRIPTED_FIELDS_DOM_ELEMENT_ID);
  node && unmountComponentAtNode(node);
}

function updateIndexedFieldsTable($scope) {
  $scope.$$postDigest(() => {
    const node = document.getElementById(REACT_INDEXED_FIELDS_DOM_ELEMENT_ID);
    if (!node) {
      return;
    }

    render(
      <I18nContext>
        <IndexedFieldsTable
          fields={$scope.fields}
          indexPattern={$scope.indexPattern}
          fieldFilter={$scope.fieldFilter}
          fieldWildcardMatcher={$scope.fieldWildcardMatcher}
          indexedFieldTypeFilter={$scope.indexedFieldTypeFilter}
          helpers={{
            redirectToRoute: (obj, route) => {
              $scope.kbnUrl.redirectToRoute(obj, route);
              $scope.$apply();
            },
            getFieldInfo: $scope.getFieldInfo,
          }}
        />
      </I18nContext>,
      node,
    );
  });
}

function destroyIndexedFieldsTable() {
  const node = document.getElementById(REACT_INDEXED_FIELDS_DOM_ELEMENT_ID);
  node && unmountComponentAtNode(node);
}

function handleTabChange($scope, newTab) {
  destroyIndexedFieldsTable();
  destroyScriptedFieldsTable();
  destroySourceFiltersTable();

  switch(newTab) {
    case 'indexedFields':
      return updateIndexedFieldsTable($scope);
    case 'scriptedFields':
      return updateScriptedFieldsTable($scope);
    case 'sourceFilters':
      return updateSourceFiltersTable($scope);
  }
}

uiRoutes
  .when('/management/kibana/index_patterns/:indexPatternId', {
    template,
    k7Breadcrumbs: getEditBreadcrumbs,
    resolve: {
      indexPattern: function ($route, Promise, redirectWhenMissing, indexPatterns) {
        return Promise.resolve(indexPatterns.get($route.current.params.indexPatternId))
          .catch(redirectWhenMissing('/management/kibana/index_patterns'));
      }
    },
  });

uiModules.get('apps/management')
  .controller('managementIndexPatternsEdit', function (
    $scope, $location, $route, Promise, config, indexPatterns, Private, confirmModal) {
    const $stateContainer = createStore({ tab: 'indexedFields' });
    Object.defineProperty($scope, 'state', {
      get() {
        return $stateContainer.get;
      }
    });
    const stateContainerSub = $stateContainer.state$.subscribe(s => {
      handleTabChange($scope, s.tab);
      if ($scope.$$phase !== '$apply' && $scope.$$phase !== '$digest') {
        $scope.$apply();
      }
    });
    handleTabChange($scope, $stateContainer.get().tab);

    $scope.$$postDigest(() => {
      $scope.destroyStateSync = syncState({ _a: $stateContainer });
    });

    const indexPatternListProvider = Private(IndexPatternListFactory)();

    $scope.fieldWildcardMatcher = (...args) => fieldWildcardMatcher(...args, config.get('metaFields'));
    $scope.editSectionsProvider = Private(IndicesEditSectionsProvider);
    $scope.kbnUrl = Private(KbnUrlProvider);
    $scope.indexPattern = $route.current.locals.indexPattern;
    $scope.indexPatternListProvider = indexPatternListProvider;
    $scope.indexPattern.tags = indexPatternListProvider.getIndexPatternTags(
      $scope.indexPattern,
      $scope.indexPattern.id === config.get('defaultIndex')
    );
    $scope.getFieldInfo = indexPatternListProvider.getFieldInfo;
    docTitle.change($scope.indexPattern.title);

    const otherPatterns = _.filter($route.current.locals.indexPatterns, pattern => {
      return pattern.id !== $scope.indexPattern.id;
    });

    $scope.$watch('indexPattern.fields', function () {
      $scope.editSections = $scope.editSectionsProvider($scope.indexPattern, $scope.fieldFilter, indexPatternListProvider);
      $scope.refreshFilters();
      $scope.fields = $scope.indexPattern.getNonScriptedFields();
    });

    $scope.refreshFilters = function () {
      const indexedFieldTypes = [];
      const scriptedFieldLanguages = [];
      $scope.indexPattern.fields.forEach(field => {
        if (field.scripted) {
          scriptedFieldLanguages.push(field.lang);
        } else {
          indexedFieldTypes.push(field.type);
        }
      });

      $scope.indexedFieldTypes = _.unique(indexedFieldTypes);
      $scope.scriptedFieldLanguages = _.unique(scriptedFieldLanguages);
    };

    $scope.changeFilter = function (filter, val) {
      $scope[filter] = val || ''; // null causes filter to check for null explicitly
    };

    $scope.changeTab = function (obj) {
      $stateContainer.set({ tab: obj.index });
    };

    $scope.$watchCollection('indexPattern.fields', function () {
      $scope.conflictFields = $scope.indexPattern.fields
        .filter(field => field.type === 'conflict');
    });

    $scope.refreshFields = function () {
      const confirmMessage = i18n.translate('kbn.management.editIndexPattern.refreshLabel', {
        defaultMessage: 'This action resets the popularity counter of each field.'
      });
      const confirmModalOptions = {
        confirmButtonText: i18n.translate('kbn.management.editIndexPattern.refreshButton', { defaultMessage: 'Refresh' }),
        onConfirm: async () => {
          await $scope.indexPattern.init(true);
          $scope.fields = $scope.indexPattern.getNonScriptedFields();
        },
        title: i18n.translate('kbn.management.editIndexPattern.refreshHeader', { defaultMessage: 'Refresh field list?' })
      };
      confirmModal(
        confirmMessage,
        confirmModalOptions
      );
    };

    $scope.removePattern = function () {
      function doRemove() {
        if ($scope.indexPattern.id === config.get('defaultIndex')) {
          config.remove('defaultIndex');

          if (otherPatterns.length) {
            config.set('defaultIndex', otherPatterns[0].id);
          }
        }

        Promise.resolve($scope.indexPattern.destroy())
          .then(function () {
            $location.url('/management/kibana/index_patterns');
          })
          .catch(fatalError);
      }

      const confirmModalOptions = {
        confirmButtonText: i18n.translate('kbn.management.editIndexPattern.deleteButton', { defaultMessage: 'Delete' }),
        onConfirm: doRemove,
        title: i18n.translate('kbn.management.editIndexPattern.deleteHeader', { defaultMessage: 'Delete index pattern?' })
      };
      confirmModal('', confirmModalOptions);
    };

    $scope.setDefaultPattern = function () {
      config.set('defaultIndex', $scope.indexPattern.id);
    };

    $scope.setIndexPatternsTimeField = function (field) {
      if (field.type !== 'date') {
        const errorMessage = i18n.translate('kbn.management.editIndexPattern.notDateErrorMessage', {
          defaultMessage: 'That field is a {fieldType} not a date.', values: { fieldType: field.type }
        });
        toastNotifications.addDanger(errorMessage);
        return;
      }
      $scope.indexPattern.timeFieldName = field.name;
      return $scope.indexPattern.save();
    };

    $scope.$watch('fieldFilter', () => {
      $scope.editSections = $scope.editSectionsProvider($scope.indexPattern, $scope.fieldFilter, indexPatternListProvider);
      if ($scope.fieldFilter === undefined) {
        return;
      }
    });

    $scope.$on('$destroy', () => {
      destroyIndexedFieldsTable();
      destroyScriptedFieldsTable();
      destroySourceFiltersTable();
      if(stateContainerSub) stateContainerSub.unsubscribe();
      if ($scope.destroyStateSync) $scope.destroyStateSync();
    });

  });
