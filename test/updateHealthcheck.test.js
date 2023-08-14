/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/updateHealthcheck.response.js';

describe('#updateHealthcheck', () => {
  const fastly = fastlyPromises('xDrqnDPrSim56UxQeZ442GQTgrAWNXun', '5gY6jizXEIvY6cgU1D1Yq4');
  let res;

  nock(config.mainEntryPoint)
    .put('/service/5gY6jizXEIvY6cgU1D1Yq4/version/1/healthcheck/example-healthcheck')
    .reply(200, response.updateHealthcheck);

  before(async () => {
    res = await fastly.updateHealthcheck(1, 'example-healthcheck', {
      name: 'example-healthcheck',
      comment: 'Example comment',
    });
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

  it('response body properties should be updated', () => {
    assert.strictEqual(res.data.comment, 'Example comment');
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
