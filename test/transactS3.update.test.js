/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import versionresponse from './response/cloneVersion.response.js';
import activateresponse from './response/activateVersion.response.js';
import getversionsresponse from './response/readVersions.response.js';
import readresponse from './response/readS3.response.js';
import updateresponse from './response/updateS3.response.js';

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
