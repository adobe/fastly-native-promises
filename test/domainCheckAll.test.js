/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/domainCheckAll.response.js';

describe('#domainCheckAll', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/182/domain/check_all')
    .reply(200, response.domainCheckAll);

  before(async () => {
    res = await fastly.domainCheckAll('182');
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

  it('response body should be an array of arrays', () => {
    res.data.forEach((item) => {
      assert.strictEqual(Array.isArray(item), true);
    });
  });

  it('response body should have three items', () => {
    res.data.forEach((item) => {
      assert.strictEqual(item.length, 3);
    });
  });
});
