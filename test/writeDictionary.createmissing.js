'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/writedictionary.response');

describe('#writeDictionary.createmissing', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', '3l2MjGcHgWw5NUJz7OKYH3');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/3l2MjGcHgWw5NUJz7OKYH3/version/1040/dictionary/strain_owners')
    .reply(404, response.get)
    .put('/service/3l2MjGcHgWw5NUJz7OKYH3/version/1040/dictionary/strain_owners', {
      write_only: true,
      name: 'strain_owners',
    })
    .reply(400, response.badput)
    .put('/service/3l2MjGcHgWw5NUJz7OKYH3/version/1040/dictionary/strain_owners', {
      write_only: false,
      name: 'owner_strains',
    })
    .reply(200, response.goodput)
    .post('/service/3l2MjGcHgWw5NUJz7OKYH3/version/1040/dictionary')
    .reply(200, response.goodpost);

  before(async () => {
    res = await fastly.writeDictionary(1040, 'strain_owners', {
      name: 'owner_strains',
      write_only: false,
    });
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

  it('response body properties should be created', () => {
    assert.strictEqual(res.data.name, 'owner_strains');
    assert.strictEqual(res.data.write_only, false);
    assert.strictEqual(res.data.deleted_at, null);
    assert.strictEqual(res.data.write_only, false);
  });

  it('response body should contain all properties', () => {
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
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
