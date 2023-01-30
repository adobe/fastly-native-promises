/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';

import response from './response/activateVersion.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#activateVersion', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;
  let err;

  nock(config.mainEntryPoint)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/253/activate')
    .reply(400, response.activateVersion400);

  before(async () => {
    err = undefined;
    try {
      res = await fastly.activateVersion('253');
    } catch (e) {
      err = e;
    }
  });

  it('response should be a status 400', () => {
    assert.strictEqual(res, undefined);
    assert.ok(err instanceof Error);
    assert.strictEqual(err.status, 400);
  });

  it('error body should exist', () => {
    assert.ok(err.data);
  });

  it('error code should exist', () => {
    assert.ok(err.code);
    assert.strictEqual(err.code, 'Bad request');
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
