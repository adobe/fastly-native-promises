/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/condition.response.js';

describe('#readConditions', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/condition')
    .reply(200, response.list);

  before(async () => {
    res = await fastly.readConditions(1);
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
    assert.strictEqual(res.data[0].name, 'testcondition');
  });

  it('response body should contain all properties', () => {
    res.data.forEach((dat) => {
      [
        'comment',
        'name',
        'priority',
        'service_id',
        'statement',
        'type',
        'version',
      ].forEach((e) => {
        assert.ok(Object.keys(dat).indexOf(e) >= 0);
      });
    });
  });
});
