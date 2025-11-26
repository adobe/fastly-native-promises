/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/configstore.response.js';

describe('#writeConfigStore error handling', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  // Test case: readConfigStores fails, but createConfigStore succeeds
  nock(config.mainEntryPoint)
    .get('/resources/stores/config')
    .reply(500, { msg: 'Internal server error' })
    .post('/resources/stores/config')
    .reply(200, response.post);

  before(async () => {
    res = await fastly.writeConfigStore('new-config-store');
  });

  it('should handle readConfigStores failure and create store anyway', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an object', () => {
    assert.strictEqual(typeof res.data, 'object');
  });

  it('response body properties should be created', () => {
    assert.strictEqual(res.data.name, 'new-config-store');
  });
});
