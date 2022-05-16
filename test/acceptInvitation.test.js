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

'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';

/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');

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
