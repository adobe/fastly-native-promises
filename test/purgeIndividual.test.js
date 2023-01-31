/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/purgeIndividual.response.js';

describe('#purgeIndividual', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .post('/purge/www.example.com/image.jpg')
    .reply(200, response.purgeIndividual);

  before(async () => {
    res = await fastly.purgeIndividual('www.example.com/image.jpg');
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
    ['status', 'id'].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
