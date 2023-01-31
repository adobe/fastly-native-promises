/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/dictitem.response.js';

describe('#readDictItems', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    // get the dictionary first
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/dictionary/my_dictionary')
    .reply(200, response.dict.get)
    // list
    .get('/service/SU1Z0isxPaozGVKXdv0eY/dictionary/5clCytcTJrnvPi8wjqPH0q/items')
    .reply(200, response.item.list);

  before(async () => {
    res = await fastly.readDictItems(1, 'my_dictionary');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an array', () => {
    assert.strictEqual(Array.isArray(res.data), true);
  });

  it('response body should be an array of objects', () => {
    res.data.forEach((item) => {
      assert.strictEqual(typeof item, 'object');
    });
  });

  it('response body should contain all properties', () => {
    res.data.forEach((item) => {
      [
        'dictionary_id',
        'service_id',
        'item_key',
        'item_value',
        'created_at',
        'deleted_at',
        'updated_at',
      ].forEach((e) => {
        assert.ok(Object.keys(item).indexOf(e) >= 0);
      });
    });
  });
});
