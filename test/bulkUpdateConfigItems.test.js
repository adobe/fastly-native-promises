/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/configstore.response.js';

describe('#bulkUpdateConfigItems', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .patch('/resources/stores/config/config-store-id-1/items')
    .reply(200, response.bulkUpdate);

  before(async () => {
    res = await fastly.bulkUpdateConfigItems(
      'config-store-id-1',
      { item_key: 'key1', item_value: 'value1', op: 'upsert' },
      { item_key: 'key2', item_value: 'value2', op: 'upsert' },
    );
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
