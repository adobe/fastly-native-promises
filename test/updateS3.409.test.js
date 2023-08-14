/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/updateS3.response.js';

describe('#updateS3', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;
  let err;

  nock(config.mainEntryPoint)
    .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/1/logging/s3/test-s3')
    .reply(409, response.updateS3409);

  before(async () => {
    try {
      res = await fastly.updateS3('1', 'test-s3', {
        name: 'updated-test-s3',
      });
    } catch (e) {
      err = e;
    }
  });

  it('response should be a status 409', () => {
    assert.strictEqual(res, undefined);
    assert.ok(err instanceof Error);
    assert.strictEqual(err.status, 409);
  });

  it('error body should exist', () => {
    assert.ok(err.data);
  });

  it('error code should exist', () => {
    assert.ok(err.code);
    assert.strictEqual(err.code, 'Duplicate record');
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
      'detail',
    ].forEach((e) => {
      assert.ok(Object.keys(err.data).indexOf(e) >= 0);
    });
  });
});
