/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/dictitem.response.js';

describe('#readDictItem', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    // get the dictionary first
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/dictionary/my_dictionary')
    .reply(200, response.dict.get)
    // list
    .get('/service/SU1Z0isxPaozGVKXdv0eY/dictionary/5clCytcTJrnvPi8wjqPH0q/item/some_key')
    .reply(200, response.item.get);

  before(async () => {
    res = await fastly.readDictItem(1, 'my_dictionary', 'some_key');
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

  it('response value should match', () => {
    assert.strictEqual(res.data.item_value, 'some_value');
  });

  it('response body should contain all properties', () => {
    [
      'dictionary_id',
      'service_id',
      'item_key',
      'item_value',
      'created_at',
      'deleted_at',
      'updated_at',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
