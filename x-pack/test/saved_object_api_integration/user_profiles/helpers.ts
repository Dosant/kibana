/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { parse as parseCookie } from 'tough-cookie';
import { FtrProviderContext } from '../common/ftr_provider_context';

export async function loginAsInteractiveUser({
  getService,
  username,
  password,
}: Pick<FtrProviderContext, 'getService'> & { username: string; password: string }): Promise<{
  Cookie: string;
}> {
  const supertest = getService('supertestWithoutAuth');

  const response = await supertest
    .post('/internal/security/login')
    .set('kbn-xsrf', 'xxx')
    .send({
      providerType: 'basic',
      providerName: 'basic',
      currentURL: '/',
      params: {
        username,
        password,
      },
    })
    .expect(200);
  const cookie = parseCookie(response.header['set-cookie'][0])!.cookieString();

  return { Cookie: cookie };
}
