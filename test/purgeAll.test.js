/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/purgeAll.response.js';

describe('#purgeAll', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/purge_all')
    .reply(200, response.purgeAll);

  before(async () => {
    res = await fastly.purgeAll();
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
    ['status'].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
