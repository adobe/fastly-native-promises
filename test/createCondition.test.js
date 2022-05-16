'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/condition.response');

describe('#createCondition', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/version/1/condition')
    .reply(200, response.post);

  before(async () => {
    res = await fastly.createCondition(1, {
      name: 'testcondition',
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
    assert.strictEqual(res.data.name, 'testcondition');
  });

  it('response body should contain all properties', () => {
    [
      'comment',
      'name',
      'priority',
      'service_id',
      'statement',
      'type',
      'version',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
