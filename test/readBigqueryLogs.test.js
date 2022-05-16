'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/readBigqueryLogs.response');

describe('#readBigqueryLogs', () => {
  const fastly = fastlyPromises(
    '923b6bd5266a7f932e41962755bd4254',
    'SU1Z0isxPaozGVKXdv0eY',
  );
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/128/logging/bigquery')
    .reply(200, response.readBigqueryLogs);

  before(async () => {
    res = await fastly.readBigqueryLogs('128');
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
        'name',
        'service_id',
        'format',
        'user',
        'secret_key',
        'project_id',
        'dataset',
        'table',
        'template_suffix',
        'response_condition',
        'created_at',
        'updated_at',
        'deleted_at',
      ].forEach((e) => {
        assert.ok(Object.keys(item).indexOf(e) >= 0);
      });
    });
  });
});
