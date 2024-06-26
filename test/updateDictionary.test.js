/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/dictionary.response.js';

describe('#updateDictionary', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/1/dictionary/my_dictionary')
    .reply(200, response.put);

  before(async () => {
    res = await fastly.updateDictionary(1, 'my_dictionary', {
      name: 'updated_dictionary',
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
    assert.strictEqual(res.data.name, 'updated_dictionary');
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
