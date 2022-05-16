'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/readS3.response');

describe('#readS3', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/logging/s3/test-s3')
    .reply(200, response.readS3);

  before(async () => {
    res = await fastly.readS3('1', 'test-s3');
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
