/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/secretstore.response.js';

describe('#writeSecretStore error handling', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  // Test case: readSecretStores fails, but createSecretStore succeeds
  nock(config.mainEntryPoint)
    .get('/resources/stores/secret')
    .reply(500, { msg: 'Internal server error' })
    .post('/resources/stores/secret')
    .reply(200, response.post);

  before(async () => {
    res = await fastly.writeSecretStore('new-secret-store');
  });

  it('should handle readSecretStores failure and create store anyway', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an object', () => {
    assert.strictEqual(typeof res.data, 'object');
  });

  it('response body properties should be created', () => {
    assert.strictEqual(res.data.name, 'new-secret-store');
  });
});
