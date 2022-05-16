'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/readS3Logs.response');

describe('#readS3Logs', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/128/logging/s3')
    .reply(200, response.readS3Logs);

  before(async () => {
    res = await fastly.readS3Logs('128');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an array', () => {
    assert.strictEqual(Array.isArray(res.data), true);
  });

  it('response body should be an array of objects', () => {
    res.data.forEach((item) => {
      assert.strictEqual(typeof item, 'object');
    });
  });

  it('response body should contain all properties', () => {
    res.data.forEach((item) => {
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
        assert.ok(Object.keys(item).indexOf(e) >= 0);
      });
    });
  });
});
