/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/readServices.response.js';

describe('#readServices', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service')
    .reply(200, response.readServices);

  before(async () => {
    res = await fastly.readServices();
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
      [
        'comment',
        'customer_id',
        'id',
        'name',
        'version',
        'versions',
      ].forEach((e) => {
        assert.ok(Object.keys(item).indexOf(e) >= 0);
      });
    });
  });
});
