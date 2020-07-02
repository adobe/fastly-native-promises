'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const expect = require('expect');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/dictitem.response');

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
    expect(res.status).toBe(200);
  });

  it('response body should exist', () => {
    expect(res.data).toBeTruthy();
  });

  it('response body should be an object', () => {
    expect(typeof res.data).toBe('object');
  });

  it('response status should be ok', () => {
    expect(res.data.status).toBe('ok');
  });
});
