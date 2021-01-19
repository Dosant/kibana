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

import {
  getState,
  GetStateReturn,
  createSearchSessionRestorationDataProvider,
} from './discover_state';
import { createBrowserHistory, History } from 'history';
import { dataPluginMock } from '../../../../data/public/mocks';
import { SavedSearch } from '../../saved_searches';

let history: History;
let state: GetStateReturn;
const getCurrentUrl = () => history.createHref(history.location);

describe('Test discover state', () => {
  beforeEach(async () => {
    history = createBrowserHistory();
    history.push('/');
    state = getState({
      getStateDefaults: () => ({ index: 'test' }),
      history,
    });
    await state.replaceUrlAppState({});
    await state.startSync();
  });
  afterEach(() => {
    state.stopSync();
  });
  test('setting app state and syncing to URL', async () => {
    state.setAppState({ index: 'modified' });
    state.flushToUrl();
    expect(getCurrentUrl()).toMatchInlineSnapshot(`"/#?_a=(index:modified)"`);
  });

  test('changing URL to be propagated to appState', async () => {
    history.push('/#?_a=(index:modified)');
    expect(state.appStateContainer.getState()).toMatchInlineSnapshot(`
      Object {
        "index": "modified",
      }
    `);
  });
  test('URL navigation to url without _a, state should not change', async () => {
    history.push('/#?_a=(index:modified)');
    history.push('/');
    expect(state.appStateContainer.getState()).toMatchInlineSnapshot(`
      Object {
        "index": "modified",
      }
    `);
  });

  test('isAppStateDirty returns  whether the current state has changed', async () => {
    state.setAppState({ index: 'modified' });
    expect(state.isAppStateDirty()).toBeTruthy();
    state.resetInitialAppState();
    expect(state.isAppStateDirty()).toBeFalsy();
  });

  test('getPreviousAppState returns the state before the current', async () => {
    state.setAppState({ index: 'first' });
    const stateA = state.appStateContainer.getState();
    state.setAppState({ index: 'second' });
    expect(state.getPreviousAppState()).toEqual(stateA);
  });
});

describe('Test discover state with legacy migration', () => {
  test('migration of legacy query ', async () => {
    history = createBrowserHistory();
    history.push(
      "/#?_a=(query:(query_string:(analyze_wildcard:!t,query:'type:nice%20name:%22yeah%22')))"
    );
    state = getState({
      getStateDefaults: () => ({ index: 'test' }),
      history,
    });
    expect(state.appStateContainer.getState()).toMatchInlineSnapshot(`
      Object {
        "index": "test",
        "query": Object {
          "language": "lucene",
          "query": Object {
            "query_string": Object {
              "analyze_wildcard": true,
              "query": "type:nice name:\\"yeah\\"",
            },
          },
        },
      }
    `);
  });
});

describe('createSearchSessionRestorationDataProvider', () => {
  let mockSavedSearch: SavedSearch = ({} as unknown) as SavedSearch;
  const mockDataPlugin = dataPluginMock.createStartContract();
  const searchSessionInfoProvider = createSearchSessionRestorationDataProvider({
    data: mockDataPlugin,
    appStateContainer: getState({
      history: createBrowserHistory(),
    }).appStateContainer,
    getSavedSearch: () => mockSavedSearch,
  });

  describe('session name', () => {
    test('No saved search returns default name', async () => {
      expect(await searchSessionInfoProvider.getName()).toBe('Discover');
    });

    test('Saved Search with a title returns saved search title', async () => {
      mockSavedSearch = ({ id: 'id', title: 'Name' } as unknown) as SavedSearch;
      expect(await searchSessionInfoProvider.getName()).toBe('Name');
    });

    test('Saved Search without a title returns default name', async () => {
      mockSavedSearch = ({ id: 'id', title: undefined } as unknown) as SavedSearch;
      expect(await searchSessionInfoProvider.getName()).toBe('Discover');
    });
  });

  describe('session state', () => {
    test('restoreState has sessionId and initialState has not', async () => {
      const searchSessionId = 'id';
      (mockDataPlugin.search.session.getSessionId as jest.Mock).mockImplementation(
        () => searchSessionId
      );
      const { initialState, restoreState } = await searchSessionInfoProvider.getUrlGeneratorData();
      expect(initialState.searchSessionId).toBeUndefined();
      expect(restoreState.searchSessionId).toBe(searchSessionId);
    });

    test('restoreState has absoluteTimeRange', async () => {
      const relativeTime = 'relativeTime';
      const absoluteTime = 'absoluteTime';
      (mockDataPlugin.query.timefilter.timefilter.getTime as jest.Mock).mockImplementation(
        () => relativeTime
      );
      (mockDataPlugin.query.timefilter.timefilter.getAbsoluteTime as jest.Mock).mockImplementation(
        () => absoluteTime
      );
      const { initialState, restoreState } = await searchSessionInfoProvider.getUrlGeneratorData();
      expect(initialState.timeRange).toBe(relativeTime);
      expect(restoreState.timeRange).toBe(absoluteTime);
    });
  });
});
