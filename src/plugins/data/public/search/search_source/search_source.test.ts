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

import { SearchSource } from './search_source';
import { IndexPattern } from '../..';
import { mockDataServices } from '../aggs/test_helpers';
import { setSearchService } from '../../services';
import { searchStartMock } from '../mocks';
import { fetchSoon } from '../legacy';
import { CoreStart } from 'kibana/public';
import { Observable } from 'rxjs';

// Setup search service mock
searchStartMock.search = jest.fn(() => {
  return new Observable(subscriber => {
    setTimeout(() => {
      subscriber.next({
        rawResponse: '',
      });
      subscriber.complete();
    }, 100);
  });
}) as any;
setSearchService(searchStartMock);

jest.mock('../legacy', () => ({
  fetchSoon: jest.fn().mockResolvedValue({}),
}));

const getComputedFields = () => ({
  storedFields: [],
  scriptFields: [],
  docvalueFields: [],
});
const mockSource = { excludes: ['foo-*'] };
const mockSource2 = { excludes: ['bar-*'] };
const indexPattern = ({
  title: 'foo',
  getComputedFields,
  getSourceFiltering: () => mockSource,
} as unknown) as IndexPattern;
const indexPattern2 = ({
  title: 'foo',
  getComputedFields,
  getSourceFiltering: () => mockSource2,
} as unknown) as IndexPattern;

describe('SearchSource', function() {
  let uiSettingsMock: jest.Mocked<CoreStart['uiSettings']>;
  beforeEach(() => {
    const { core } = mockDataServices();
    uiSettingsMock = core.uiSettings;
    jest.clearAllMocks();
  });

  describe('#setField()', function() {
    it('sets the value for the property', function() {
      const searchSource = new SearchSource();
      searchSource.setField('aggs', 5);
      expect(searchSource.getField('aggs')).toBe(5);
    });
  });

  describe('#getField()', function() {
    it('gets the value for the property', function() {
      const searchSource = new SearchSource();
      searchSource.setField('aggs', 5);
      expect(searchSource.getField('aggs')).toBe(5);
    });
  });

  describe(`#setField('index')`, function() {
    describe('auto-sourceFiltering', function() {
      describe('new index pattern assigned', function() {
        it('generates a searchSource filter', async function() {
          const searchSource = new SearchSource();
          expect(searchSource.getField('index')).toBe(undefined);
          expect(searchSource.getField('source')).toBe(undefined);
          searchSource.setField('index', indexPattern);
          expect(searchSource.getField('index')).toBe(indexPattern);
          const request = await searchSource.getSearchRequestBody();
          expect(request._source).toBe(mockSource);
        });

        it('removes created searchSource filter on removal', async function() {
          const searchSource = new SearchSource();
          searchSource.setField('index', indexPattern);
          searchSource.setField('index', undefined);
          const request = await searchSource.getSearchRequestBody();
          expect(request._source).toBe(undefined);
        });
      });

      describe('new index pattern assigned over another', function() {
        it('replaces searchSource filter with new', async function() {
          const searchSource = new SearchSource();
          searchSource.setField('index', indexPattern);
          searchSource.setField('index', indexPattern2);
          expect(searchSource.getField('index')).toBe(indexPattern2);
          const request = await searchSource.getSearchRequestBody();
          expect(request._source).toBe(mockSource2);
        });

        it('removes created searchSource filter on removal', async function() {
          const searchSource = new SearchSource();
          searchSource.setField('index', indexPattern);
          searchSource.setField('index', indexPattern2);
          searchSource.setField('index', undefined);
          const request = await searchSource.getSearchRequestBody();
          expect(request._source).toBe(undefined);
        });
      });
    });
  });

  describe('#onRequestStart()', () => {
    it('should be called when starting a request', async () => {
      const searchSource = new SearchSource({ index: indexPattern });
      const fn = jest.fn();
      searchSource.onRequestStart(fn);
      const options = {};
      await searchSource.fetch(options);
      expect(fn).toBeCalledWith(searchSource, options);
    });

    it('should not be called on parent searchSource', async () => {
      const parent = new SearchSource();
      const searchSource = new SearchSource({ index: indexPattern });

      const fn = jest.fn();
      searchSource.onRequestStart(fn);
      const parentFn = jest.fn();
      parent.onRequestStart(parentFn);
      const options = {};
      await searchSource.fetch(options);

      expect(fn).toBeCalledWith(searchSource, options);
      expect(parentFn).not.toBeCalled();
    });

    it('should be called on parent searchSource if callParentStartHandlers is true', async () => {
      const parent = new SearchSource();
      const searchSource = new SearchSource({ index: indexPattern }).setParent(parent, {
        callParentStartHandlers: true,
      });

      const fn = jest.fn();
      searchSource.onRequestStart(fn);
      const parentFn = jest.fn();
      parent.onRequestStart(parentFn);
      const options = {};
      await searchSource.fetch(options);

      expect(fn).toBeCalledWith(searchSource, options);
      expect(parentFn).toBeCalledWith(searchSource, options);
    });
  });

  describe('#legacy fetch()', () => {
    beforeEach(() => {
      uiSettingsMock.get.mockImplementation(() => {
        return true; // batchSearches = true
      });
    });

    afterEach(() => {
      uiSettingsMock.get.mockImplementation(() => {
        return false; // batchSearches = false
      });
    });

    it('should call msearch', async () => {
      const searchSource = new SearchSource({ index: indexPattern });
      const options = {};
      await searchSource.fetch(options);
      expect(fetchSoon).toBeCalledTimes(1);
    });
  });

  describe('#search service fetch()', () => {
    it('should call msearch', async () => {
      const searchSource = new SearchSource({ index: indexPattern });
      const options = {};
      await searchSource.fetch(options);
      expect(searchStartMock.search).toBeCalledTimes(1);
    });
  });
});
