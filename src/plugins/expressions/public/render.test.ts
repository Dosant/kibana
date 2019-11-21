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

import { render, ExpressionRenderHandler } from './render';
import { Observable } from 'rxjs';
import { Data, ExpressionRenderDefinition, IInterpreterRenderHandlers } from './types';
import { getRenderersRegistry } from './services';
import { first, take, toArray } from 'rxjs/operators';

const element: HTMLElement = {} as HTMLElement;
const mockNotificationService = {
  toasts: {
    addError: jest.fn(() => {}),
  },
};
jest.mock('./services', () => {
  const renderers: Record<string, unknown> = {
    test: {
      render: (el: HTMLElement, value: unknown, handlers: IInterpreterRenderHandlers) => {
        handlers.done();
      },
    },
  };

  return {
    getRenderersRegistry: jest.fn(() => ({
      get: jest.fn((id: string) => renderers[id]),
    })),
    getNotifications: jest.fn(() => {
      return mockNotificationService;
    }),
  };
});

const mockMockErrorRenderFunction = jest.fn(
  async (el: HTMLElement, data: Data, handlers: IInterpreterRenderHandlers) => handlers.done()
);
export const createMockErrorRenderer: () => ExpressionRenderDefinition = () => ({
  name: 'error_renderer',
  displayName: 'error rederer',
  reuseDomNode: true,
  render: mockMockErrorRenderFunction,
});
// extracts data from mockMockErrorRenderFunction call to assert in tests
const expectRenderedError = () => expect(mockMockErrorRenderFunction.mock.calls[0][1]);

describe('render helper function', () => {
  it('returns ExpressionRenderHandler instance', () => {
    const response = render(element, {});
    expect(response).toBeInstanceOf(ExpressionRenderHandler);
  });
});

describe('ExpressionRenderHandler', () => {
  it('constructor creates observers', () => {
    const expressionRenderHandler = new ExpressionRenderHandler(element);
    expect(expressionRenderHandler.events$).toBeInstanceOf(Observable);
    expect(expressionRenderHandler.render$).toBeInstanceOf(Observable);
    expect(expressionRenderHandler.update$).toBeInstanceOf(Observable);
    expect(expressionRenderHandler.error$).toBeInstanceOf(Observable);
  });

  it('getElement returns the element', () => {
    const expressionRenderHandler = new ExpressionRenderHandler(element);
    expect(expressionRenderHandler.getElement()).toBe(element);
  });

  describe('render()', () => {
    beforeEach(() => {
      mockMockErrorRenderFunction.mockReset();
      mockNotificationService.toasts.addError.mockReset();
    });

    it('in case of error render$ should emit when error renderer is finished', async () => {
      const expressionRenderHandler = new ExpressionRenderHandler(element);
      expressionRenderHandler.render(false);
      const promise1 = expressionRenderHandler.render$.pipe(first()).toPromise();
      await expect(promise1).resolves.toEqual(1);

      expressionRenderHandler.render(false);
      const promise2 = expressionRenderHandler.render$.pipe(first()).toPromise();
      await expect(promise2).resolves.toEqual(2);
    });

    it('error$ should emit in case of error', async () => {
      const expressionRenderHandler = new ExpressionRenderHandler(element);
      const errorPromise = expressionRenderHandler.error$.pipe(first()).toPromise();
      await expressionRenderHandler.render(false);
      await expect(errorPromise).resolves.toEqual({
        message: `invalid data provided to the expression renderer`,
      });
    });

    it('should use custom error renderer if provided', async () => {
      const expressionRenderHandler = new ExpressionRenderHandler(element, {
        customErrorRenderer: createMockErrorRenderer(),
      });
      await expressionRenderHandler.render(false);
      expectRenderedError().toEqual({
        type: 'error',
        error: {
          message: `invalid data provided to the expression renderer`,
        },
      });
    });

    it('should emit error if renderer does not exist', async () => {
      const expressionRenderHandler = new ExpressionRenderHandler(element);
      const errorPromise = expressionRenderHandler.error$.pipe(first()).toPromise();
      await expressionRenderHandler.render({ type: 'render', as: 'something' });
      await expect(errorPromise).resolves.toEqual({
        message: `invalid renderer id 'something'`,
      });
    });

    it('should render error if the rendering function throws', async () => {
      (getRenderersRegistry as jest.Mock).mockReturnValueOnce({ get: () => true });
      (getRenderersRegistry as jest.Mock).mockReturnValueOnce({
        get: () => ({
          render: () => {
            throw new Error('renderer error');
          },
        }),
      });

      const expressionRenderHandler = new ExpressionRenderHandler(element);
      const errorPromise = expressionRenderHandler.error$.pipe(first()).toPromise();
      await expressionRenderHandler.render({ type: 'render', as: 'something' });
      await expect(errorPromise).resolves.toEqual({
        message: 'renderer error',
      });
    });

    it('sends a next observable once rendering is complete', () => {
      const expressionRenderHandler = new ExpressionRenderHandler(element);
      expect.assertions(1);
      return new Promise(resolve => {
        expressionRenderHandler.render$.subscribe(renderCount => {
          expect(renderCount).toBe(1);
          resolve();
        });

        expressionRenderHandler.render({ type: 'render', as: 'test' });
      });
    });

    it('default renderer should use notification service', async () => {
      const expressionRenderHandler = new ExpressionRenderHandler(element);
      const promise1 = expressionRenderHandler.render$.pipe(first()).toPromise();
      expressionRenderHandler.render(false);
      await expect(promise1).resolves.toEqual(1);
      expect(mockNotificationService.toasts.addError).toBeCalledWith(
        {
          message: 'invalid data provided to the expression renderer',
        },
        {
          title: 'Error in visualisation',
          toastMessage: 'invalid data provided to the expression renderer',
        }
      );
    });

    // in case render$ subscription happen after render() got called
    // we still want to be notified about sync render$ updates
    it("doesn't swallow sync render errors", async () => {
      const expressionRenderHandler1 = new ExpressionRenderHandler(element);
      expressionRenderHandler1.render(false);
      const renderPromiseAfterRender = expressionRenderHandler1.render$.pipe(first()).toPromise();
      const errorPromiseAfterRender = expressionRenderHandler1.error$.pipe(first()).toPromise();
      await expect(renderPromiseAfterRender).resolves.toEqual(1);
      await expect(errorPromiseAfterRender).resolves.toEqual({
        message: 'invalid data provided to the expression renderer',
      });

      const expressionRenderHandler2 = new ExpressionRenderHandler(element);
      const renderPromiseBeforeRender = expressionRenderHandler2.render$.pipe(first()).toPromise();
      const errorPromiseBeforeRender = expressionRenderHandler2.error$.pipe(first()).toPromise();
      expressionRenderHandler2.render(false);
      await expect(renderPromiseBeforeRender).resolves.toEqual(1);
      await expect(errorPromiseBeforeRender).resolves.toEqual({
        message: 'invalid data provided to the expression renderer',
      });
    });

    // it is expected side effect of using BehaviorSubject for render$ and error$,
    // that observables will emit previous result if subscription happens after render
    it('should emit previous render and error results', async () => {
      const expressionRenderHandler = new ExpressionRenderHandler(element);
      expressionRenderHandler.render(false);
      const renderPromise = expressionRenderHandler.render$.pipe(take(2), toArray()).toPromise();
      const errorPromise = expressionRenderHandler.error$.pipe(take(2), toArray()).toPromise();
      expressionRenderHandler.render(false);
      await expect(renderPromise).resolves.toEqual([1, 2]);
      await expect(errorPromise).resolves.toEqual([
        {
          message: 'invalid data provided to the expression renderer',
        },
        {
          message: 'invalid data provided to the expression renderer',
        },
      ]);
    });
  });
});
