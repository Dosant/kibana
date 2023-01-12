/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import type { CommonFields } from '../../common';
import type { EventBus } from './event_bus';
import type { ContentRegistry } from './registry';
import type { ContentStorage } from './types';

export class ContentCrud<UniqueFields extends object = Record<string, unknown>>
  implements ContentStorage<UniqueFields>
{
  private storage: ContentStorage<UniqueFields>;
  private eventBus: EventBus;
  public contentType: string;

  constructor(
    contentType: string,
    deps: {
      contentRegistry: ContentRegistry;
      eventBus: EventBus;
    }
  ) {
    this.contentType = contentType;
    this.storage = deps.contentRegistry.getStorage<UniqueFields>(contentType);
    this.eventBus = deps.eventBus;
  }

  public get(contentId: string, options?: unknown) {
    this.eventBus.emit({
      type: 'getItemStart',
      contentId,
      contentType: this.contentType,
    });

    return this.storage
      .get(contentId, options)
      .then((res) => {
        this.eventBus.emit({
          type: 'getItemSuccess',
          contentId,
          contentType: this.contentType,
          data: res,
        });

        return res;
      })
      .catch((e) => {
        this.eventBus.emit({
          type: 'getItemError',
          contentId,
          contentType: this.contentType,
          error: e,
        });

        throw e;
      });
  }

  public mget(ids: string[], options?: unknown) {
    return this.storage.mget(ids, options);
  }

  public create(fields: UniqueFields & CommonFields, options?: unknown) {
    return this.storage.create(fields, options);
  }

  public update<T extends Partial<UniqueFields & CommonFields>>(
    id: string,
    fields: T,
    options?: unknown
  ): Promise<Partial<T & InternalFields>> {
    return this.storage.update(id, fields, options);
  }

  public delete(id: string, options?: unknown) {
    return this.storage.delete(id, options);
  }

  public search<O extends SearchOptions = SearchOptions>(options: O) {
    return this.storage.search(options);
  }
}
