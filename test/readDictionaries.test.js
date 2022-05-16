'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/dictionary.response');

describe('#updateDictionary', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/dictionary')
    .reply(200, response.list);

  before(async () => {
    res = await fastly.readDictionaries(1);
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an object', () => {
    assert.ok(Array.isArray(res.data));
  });

  it('response body properties should be created', () => {
    assert.strictEqual(res.data[0].name, 'my_dictionary');
    assert.strictEqual(res.data[0].deleted_at, null);
    assert.strictEqual(res.data[0].write_only, false);
  });

  it('response body should contain all properties', () => {
    res.data.forEach((dat) => {
      [
        'created_at',
        'deleted_at',
        'id',
        'name',
        'service_id',
        'updated_at',
        'version',
        'write_only',
      ].forEach((e) => {
        assert.ok(Object.keys(dat).indexOf(e) >= 0);
      });
    });
  });
});
