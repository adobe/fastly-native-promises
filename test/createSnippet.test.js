'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/createSnippet.response');

describe('#createSnippet', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/version/1/snippet')
    .reply(200, response.createSnippet);

  before(async () => {
    res = await fastly.createSnippet('1', {
      name: 'my_snippet', priority: '10', dynamic: '1', type: 'fetch',
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
    assert.strictEqual(res.data.name, 'my_snippet');
    assert.strictEqual(res.data.priority, '10');
    assert.strictEqual(res.data.dynamic, '1');
    assert.strictEqual(res.data.type, 'fetch');
  });

  it('response body should contain all properties', () => {
    [
      'name',
      'priority',
      'dynamic',
      'content',
      'type',
      'service_id',
      'version',
      'deleted_at',
      'created_at',
      'updated_at',
      'id',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
