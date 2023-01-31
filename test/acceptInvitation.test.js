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

describe('#acceptInvitations', () => {
  const fastly = fastlyPromises();
  let res;

  nock(config.mainEntryPoint)
    .put('/invitation/accept/1234')
    .reply(200, { status: 'ok' });

  before(async () => {
    res = await fastly.acceptInvitation('1234', 'john', 'password');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should contain all properties', () => {
    assert.deepStrictEqual(res.data, { status: 'ok' });
  });
});
