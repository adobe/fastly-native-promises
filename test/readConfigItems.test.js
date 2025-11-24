/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/configstore.response.js';

describe('#readConfigItems', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/resources/stores/config/config-store-id-1/items')
    .reply(200, response.listItems);

  before(async () => {
    res = await fastly.readConfigItems('config-store-id-1');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body data should be an array', () => {
    assert.ok(Array.isArray(res.data.data));
  });

  it('response body should contain item properties', () => {
    const item = res.data.data[0];
    ['item_key', 'item_value', 'created_at', 'updated_at'].forEach((e) => {
      assert.ok(Object.keys(item).indexOf(e) >= 0);
    });
  });
});
