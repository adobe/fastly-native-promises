/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/header.response.js';

describe('#updateHeader', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/1/header/testheader')
    .reply(200, response.put);

  before(async () => {
    res = await fastly.updateHeader(1, 'testheader', {
      name: 'updatedtestheader',
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
    assert.strictEqual(res.data.name, 'updatedtestheader');
  });

  it('response body should contain all properties', () => {
    [
      'action',
      'cache_condition',
      'dst',
      'ignore_if_set',
      'name',
      'priority',
      'regex',
      'request_condition',
      'response_condition',
      'service_id',
      'src',
      'substitution',
      'type',
      'version',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
