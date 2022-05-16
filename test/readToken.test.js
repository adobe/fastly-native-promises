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
const response = require('./response/tokens.response');

describe('#readToken', () => {
  it('response should be a status 200', async () => {
    const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
    nock(config.mainEntryPoint)
      .get('/tokens')
      .reply(200, response.tokens);
    const res = await fastly.readToken('deadbeefEEiDptTRb90e');

    assert.strictEqual(res.status, 200);
  });

  it('response body should contain all properties', async () => {
    const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
    nock(config.mainEntryPoint)
      .get('/tokens')
      .reply(200, response.tokens);
    const res = await fastly.readToken('deadbeefEEiDptTRb90e');

    assert.deepStrictEqual(res.data, response.tokens[0]);
  });

  it('should fail if token does not exit', async () => {
    const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
    nock(config.mainEntryPoint)
      .get('/tokens')
      .reply(200, response.tokens);

    try {
      await fastly.readToken('does not exist');
      assert.fail('non existent token should fail');
    } catch (e) {
      assert.strictEqual(e.message, 'No such token.');
    }
  });
});
