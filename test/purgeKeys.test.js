/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/purgeKeys.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#purgeKeys', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/purge')
    .reply(200, response.purgeKeys);

  before(async () => {
    res = await fastly.purgeKeys(['key_1', 'key_2', 'key_3']);
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an object', () => {
    assert.strictEqual(typeof res.data, 'object');
  });

  it('response body should contain all properties', () => {
    ['key_1', 'key_2', 'key_3'].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
