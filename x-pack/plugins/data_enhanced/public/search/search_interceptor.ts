/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { once } from 'lodash';
import { throwError, Subscription } from 'rxjs';
import { tap, finalize, catchError, filter, take, skip } from 'rxjs/operators';
import {
  TimeoutErrorMode,
  SearchInterceptor,
  SearchInterceptorDeps,
  UI_SETTINGS,
  IKibanaSearchRequest,
  SearchSessionState,
} from '../../../../../src/plugins/data/public';
import { ENHANCED_ES_SEARCH_STRATEGY, IAsyncSearchOptions, pollSearch } from '../../../../../src/plugins/data/common';
import { SearchAbortController } from './search_abort_controller';

export class EnhancedSearchInterceptor extends SearchInterceptor {
  private uiSettingsSub: Subscription;
  private searchTimeout: number;

  /**
   * @internal
   */
  constructor(deps: SearchInterceptorDeps) {
    super(deps);
    this.searchTimeout = deps.uiSettings.get(UI_SETTINGS.SEARCH_TIMEOUT);

    this.uiSettingsSub = deps.uiSettings
      .get$(UI_SETTINGS.SEARCH_TIMEOUT)
      .subscribe((timeout: number) => {
        this.searchTimeout = timeout;
      });
  }

  public stop() {
    this.uiSettingsSub.unsubscribe();
  }

  protected getTimeoutMode() {
    return this.application.capabilities.advancedSettings?.save
      ? TimeoutErrorMode.CHANGE
      : TimeoutErrorMode.CONTACT;
  }

  public search({ id, ...request }: IKibanaSearchRequest, options: IAsyncSearchOptions = {}) {
    const searchOptions = {
      strategy: ENHANCED_ES_SEARCH_STRATEGY,
      ...options,
    };
    const { sessionId, strategy, abortSignal } = searchOptions;
    const search = () => this.runSearch({ id, ...request }, searchOptions);

    const searchAbortController = new SearchAbortController(abortSignal, this.searchTimeout);
    this.pendingCount$.next(this.pendingCount$.getValue() + 1);
    const untrackSearch = this.deps.session.isCurrentSession(options.sessionId)
      ? this.deps.session.trackSearch({ abort: () => searchAbortController.abort() })
      : undefined;

    // track if this search's session will be send to background
    // if yes, then we don't need to cancel this search when it is aborted
    let isSavedToBackground = false;
    const savedToBackgroundSub =
      this.deps.session.isCurrentSession(sessionId) &&
      this.deps.session.state$
        .pipe(
          skip(1), // ignore any state, we are only interested in transition x -> BackgroundLoading
          filter(
            (state) =>
              this.deps.session.isCurrentSession(sessionId) &&
              state === SearchSessionState.BackgroundLoading
          ),
          take(1)
        )
        .subscribe(() => {
          isSavedToBackground = true;
        });

    const cancel = once(() => {
      if (id && !isSavedToBackground) this.deps.http.delete(`/internal/search/${strategy}/${id}`);
    });

    return pollSearch(search, cancel, {
      ...options,
      abortSignal: searchAbortController.getSignal(),
    }).pipe(
      tap((response) => (id = response.id)),
      catchError((e: Error) => {
        cancel();
        return throwError(this.handleSearchError(e, options, searchAbortController.isTimeout()));
      }),
      finalize(() => {
        this.pendingCount$.next(this.pendingCount$.getValue() - 1);
        searchAbortController.cleanup();
        if (untrackSearch && this.deps.session.isCurrentSession(options.sessionId)) {
          // untrack if this search still belongs to current session
          untrackSearch();
        }
        if (savedToBackgroundSub) {
          savedToBackgroundSub.unsubscribe();
        }
      })
    );
  }
}
