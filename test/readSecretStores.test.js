/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/secretstore.response.js';

describe('#readSecretStores', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/resources/stores/secret')
    .reply(200, response.list);

  before(async () => {
    res = await fastly.readSecretStores();
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

  it('response body should contain store properties', () => {
    const store = res.data.data[0];
    ['id', 'name', 'created_at', 'write_only'].forEach((e) => {
      assert.ok(Object.keys(store).indexOf(e) >= 0);
    });
  });
});
