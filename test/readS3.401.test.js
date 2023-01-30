/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/readS3.response.js';

describe('#readS3.401', () => {
  const fastly = fastlyPromises('invalid', 'SU1Z0isxPaozGVKXdv0eY');
  let res;
  let err;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/logging/s3/test-s3-does-not-exist')
    .reply(401, response.readS3401);

  before(async () => {
    err = undefined;
    try {
      res = await fastly.readS3('1', 'test-s3-does-not-exist');
    } catch (e) {
      err = e;
    }
  });

  it('response should be a status 401', () => {
    assert.strictEqual(res, undefined);
    assert.ok(err instanceof Error);
    assert.strictEqual(err.status, 401);
  });

  it('error body should exist', () => {
    assert.ok(err.data);
  });

  it('error code should exist', () => {
    assert.ok(err.code);
    assert.strictEqual(err.code, 'Provided credentials are missing or invalid');
  });

  it('error message should exist', () => {
    assert.ok(err.message);
  });

  it('error body should be an object', () => {
    assert.strictEqual(typeof err.data, 'object');
  });

  it('response err should contain all properties', () => {
    [
      'msg',
    ].forEach((e) => {
      assert.ok(Object.keys(err.data).indexOf(e) >= 0);
    });
  });
});
