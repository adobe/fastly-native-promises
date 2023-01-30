/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/deleteHealthcheck.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#deleteHealthcheck', () => {
  const fastly = fastlyPromises('xDrqnDPrSim56UxQeZ442GQTgrAWNXun', '5gY6jizXEIvY6cgU1D1Yq4');
  let res;

  nock(config.mainEntryPoint)
    .delete('/service/5gY6jizXEIvY6cgU1D1Yq4/version/1/healthcheck/example-healthcheck')
    .reply(200, response.deleteHealthcheck);

  before(async () => {
    res = await fastly.deleteHealthcheck(1, 'example-healthcheck');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body properties should be created', () => {
    assert.strictEqual(res.data.status, 'ok');
  });

  it('response body should contain all properties', () => {
    [
      'status',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
