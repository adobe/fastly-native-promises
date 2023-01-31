/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/response.response.js';

describe('#createResponse', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/version/1/response_object')
    .reply(200, response.post);

  before(async () => {
    res = await fastly.createResponse(1, {
      name: 'test-response',
    });
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

  it('response body properties should be created', () => {
    assert.strictEqual(res.data.name, 'test-response');
  });

  it('response body should contain all properties', () => {
    [
      'cache_condition',
      'content',
      'content_type',
      'name',
      'request_condition',
      'response',
      'service_id',
      'status',
      'version',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
