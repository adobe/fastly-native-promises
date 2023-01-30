/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/cloneVersion.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#cloneVersion', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/134/clone')
    .reply(200, response.cloneVersion);

  before(async () => {
    res = await fastly.cloneVersion('134');
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

  it('response body property should be greater than cloned version number', () => {
    assert.ok(res.data.number > 134);
  });

  it('response body should contain all properties', () => {
    [
      'testing',
      'locked',
      'number',
      'active',
      'service_id',
      'staging',
      'created_at',
      'deleted_at',
      'comment',
      'updated_at',
      'deployed',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
