/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/readHealthchecks.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#readHealthChecks', () => {
  const fastly = fastlyPromises('xDrqnDPrSim56UxQeZ442GQTgrAWNXun', '5gY6jizXEIvY6cgU1D1Yq4');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/5gY6jizXEIvY6cgU1D1Yq4/version/1/healthcheck')
    .reply(200, response.readHealthchecks);

  before(async () => {
    res = await fastly.readHealthchecks(1);
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an array', () => {
    assert.ok(Array.isArray(res.data));
  });

  it('response body properties should be created', () => {
    assert.strictEqual(res.data[0].name, 'example-healthcheck');
  });

  it('response body should contain all properties', () => {
    res.data.forEach((dat) => {
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
        assert.ok(Object.keys(dat).indexOf(e) >= 0);
      });
    });
  });
});
