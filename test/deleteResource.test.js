/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/resource.response.js';

describe('#deleteResource', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .delete('/service/SU1Z0isxPaozGVKXdv0eY/version/1/resource/store-id-1')
    .reply(200, response.delete);

  before(async () => {
    res = await fastly.deleteResource('1', 'store-id-1');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should contain status ok', () => {
    assert.strictEqual(res.data.status, 'ok');
  });
});
