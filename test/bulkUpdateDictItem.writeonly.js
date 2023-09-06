/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/dictitem.response.js';

describe('#bulkUpdateDictItems.writeonly', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    // get the dictionary first
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/dictionary/secret_dictionary')
    .reply(200, response.dict.getsecret)
    // then get the dict item
    .patch('/service/SU1Z0isxPaozGVKXdv0eY/dictionary/5clCytcTJrnvPi8wjqPH0q/items', {
      items: [
        { item_key: 'some_key', item_value: 'some_value', op: 'update' },
      ],
    })
    .reply(200, response.item.bulk);

  before(async () => {
    res = await fastly.bulkUpdateDictItems(1, 'secret_dictionary', { item_key: 'some_key', item_value: 'some_value', op: 'update' });
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
