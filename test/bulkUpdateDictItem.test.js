/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/dictitem.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#bulkUpdateDictItems', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    // get the dictionary first
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/dictionary/my_dictionary')
    .reply(200, response.dict.get)
    // then get the dict item
    .patch('/service/SU1Z0isxPaozGVKXdv0eY/dictionary/5clCytcTJrnvPi8wjqPH0q/items', {
      items: [
        { item_key: 'some_key', item_value: 'some_value', op: 'create' },
      ],
    })
    .reply(200, response.item.bulk);

  before(async () => {
    res = await fastly.bulkUpdateDictItems(1, 'my_dictionary', { item_key: 'some_key', item_value: 'some_value', op: 'create' });
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

  it('response status should be ok', () => {
    assert.strictEqual(res.data.status, 'ok');
  });
});
