/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/edgeCheck.response.js';

describe('#edgeCheck', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/content/edge_check?url=www.example.com/foo/bar')
    .reply(200, response.edgeCheck);

  before(async () => {
    res = await fastly.edgeCheck('www.example.com/foo/bar');
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
      ['hash', 'request', 'response', 'response_time', 'server'].forEach((e) => {
        assert.ok(Object.keys(item).indexOf(e) >= 0);
      });
    });
  });
});
