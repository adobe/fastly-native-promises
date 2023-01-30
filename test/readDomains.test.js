/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/readDomains.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#readDomains', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/182/domain')
    .reply(200, response.readDomains);

  before(async () => {
    res = await fastly.readDomains('182');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an array', () => {
    assert.strictEqual(Array.isArray(res.data), true);
  });

  it('response body should be an array of objects', () => {
    res.data.forEach((item) => {
      assert.strictEqual(typeof item, 'object');
    });
  });

  it('response body should contain all properties', () => {
    res.data.forEach((item) => {
      ['comment', 'name', 'service_id', 'version'].forEach((e) => {
        assert.ok(Object.keys(item).indexOf(e) >= 0);
      });
    });
  });
});
