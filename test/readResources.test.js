/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/resource.response.js';

describe('#readResources', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/resource')
    .reply(200, response.list);

  before(async () => {
    res = await fastly.readResources('1');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an array', () => {
    assert.ok(Array.isArray(res.data));
  });

  it('response body should contain resource link properties', () => {
    const resource = res.data[0];
    ['id', 'name', 'resource_id', 'created_at'].forEach((e) => {
      assert.ok(Object.keys(resource).indexOf(e) >= 0);
    });
  });
});
