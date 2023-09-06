/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/response.response.js';

describe('#readResponses', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/response_object')
    .reply(200, response.list);

  before(async () => {
    res = await fastly.readResponses(1);
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an object', () => {
    assert.ok(Array.isArray(res.data));
  });

  it('response body properties should be created', () => {
    assert.strictEqual(res.data[0].name, 'test-response');
  });

  it('response body should contain all properties', () => {
    res.data.forEach((dat) => {
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
        assert.ok(Object.keys(dat).indexOf(e) >= 0);
      });
    });
  });
});
