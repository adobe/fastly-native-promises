/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response0 from './response/readUser.response.js';
import response1 from './response/readUsers.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';

describe('#readUsers', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/customer/deadbeef19zEASHfCMNSu/users')
    .reply(200, response1.readUsers)
    .get('/current_user')
    .reply(200, response0.readUser);

  before(async () => {
    res = await fastly.readUsers();
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should contain all properties', () => {
    assert.deepStrictEqual(res.data, response1.readUsers);
  });
});
