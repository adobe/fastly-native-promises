'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const versionresponse = require('./response/cloneVersion.response');
const activateresponse = require('./response/activateVersion.response');
const getversionsresponse = require('./response/readVersions.response');
const readresponse = require('./response/readS3.response');
const updateresponse = require('./response/updateS3.response');

describe('#transactS3.update', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version')
    .reply(200, getversionsresponse.readVersions)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/1/clone')
    .reply(200, versionresponse.cloneVersionDefault)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/2/logging/s3/test-s3')
    .reply(200, readresponse.readS3)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/2/logging/s3/test-s3')
    .reply(200, updateresponse.updateS3)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/2/activate')
    .reply(200, activateresponse.activateVersion);

  before(async () => {
    res = await fastly.transact((version) => fastly.writeS3(version, 'test-s3', {
      name: 'test-s3',
      bucket_name: 'my_corporate_bucket',
      access_key: 'AKIAIOSFODNN7EXAMPLE',
      secret_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    }));
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

  it('response body should contain all properties', () => {
    [
      'access_key',
      'bucket_name',
      'created_at',
      'deleted_at',
      'domain',
      'format',
      'format_version',
      'gzip_level',
      'message_type',
      'name',
      'path',
      'period',
      'placement',
      'redundancy',
      'response_condition',
      'secret_key',
      'service_id',
      'timestamp_format',
      'updated_at',
      'version',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
