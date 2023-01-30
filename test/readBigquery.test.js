/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/readBigquery.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#readBigquery', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/logging/s3/my_bigquery_logging')
    .reply(200, response.readBigquery);

  before(async () => {
    res = await fastly.readS3('1', 'my_bigquery_logging');
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
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
