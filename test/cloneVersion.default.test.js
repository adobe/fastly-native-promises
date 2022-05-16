/* eslint-env mocha */

'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/cloneVersion.response');
const getversionsresponse = require('./response/readVersions.response');

describe('#cloneVersion.default', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version')
    .reply(200, getversionsresponse.readVersions)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/1/clone')
    .reply(200, response.cloneVersionDefault);

  before(async () => {
    res = await fastly.cloneVersion();
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
    assert.ok(res.data.number > 1);
  });

  it('current version should be increased', async () => {
    assert.ok((await fastly.getVersions()).current > 1);
  });

  it('latest version should be increased', async () => {
    assert.ok((await fastly.getVersions()).latest > 1);
  });

  it('active version should be unchanged', async () => {
    assert.strictEqual((await fastly.getVersions()).active, 1);
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
