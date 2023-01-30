/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/readHealthcheck.response.js';

describe('#readHealthCheck', () => {
  const fastly = fastlyPromises('xDrqnDPrSim56UxQeZ442GQTgrAWNXun', '5gY6jizXEIvY6cgU1D1Yq4');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/5gY6jizXEIvY6cgU1D1Yq4/version/1/healthcheck/example-healthcheck')
    .reply(200, response.readHealthcheck);

  before(async () => {
    res = await fastly.readHealthcheck(1, 'example-healthcheck');
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
    assert.strictEqual(res.data.name, 'example-healthcheck');
  });

  it('response body should contain all properties', () => {
    [
      'name',
      'host',
      'path',
      'method',
      'expected_response',
      'check_interval',
      'comment',
      'http_version',
      'initial',
      'service_id',
      'threshold',
      'timeout',
      'version',
      'window',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
