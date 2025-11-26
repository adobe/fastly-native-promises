/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/secretstore.response.js';

describe('#readSecrets', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/resources/stores/secret/store-id-1/secrets')
    .reply(200, response.listSecrets);

  before(async () => {
    res = await fastly.readSecrets('store-id-1');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body data should be an array', () => {
    assert.ok(Array.isArray(res.data.data));
  });

  it('response body should contain secret properties', () => {
    const secret = res.data.data[0];
    ['name', 'created_at', 'updated_at', 'recreated'].forEach((e) => {
      assert.ok(Object.keys(secret).indexOf(e) >= 0);
    });
  });
});
