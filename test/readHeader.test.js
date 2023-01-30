/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/header.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#readHeader', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;
  let res2;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/header/testheader')
    .reply(200, response.get);

  before(async () => {
    res = await fastly.readHeader(1, 'testheader');
    res2 = await fastly.readHeader(1, 'testheader');
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

  it('response should be the same for repeated invocations', () => {
    assert.strictEqual(res2, res);
  });

  it('response body properties should be created', () => {
    assert.strictEqual(res.data.name, 'testheader');
    assert.strictEqual(res.data.dst, 'http.foo');
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
