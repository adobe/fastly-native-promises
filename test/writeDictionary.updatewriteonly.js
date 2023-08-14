/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/writedictionary.response.js';

describe('#writeDictionary.updatewriteonly', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', '3l2MjGcHgWw5NUJz7OKYH3');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/3l2MjGcHgWw5NUJz7OKYH3/version/1040/dictionary/strain_owners')
    .reply(200, response.get)
    .put('/service/3l2MjGcHgWw5NUJz7OKYH3/version/1040/dictionary/strain_owners', {
      write_only: true,
      name: 'strain_owners',
    })
    .reply(400, response.badput)
    .post('/service/3l2MjGcHgWw5NUJz7OKYH3/version/1040/dictionary')
    .reply(409, response.badpost);

  before(async () => {
    res = await fastly.writeDictionary(1040, 'strain_owners', {
      name: 'strain_owners',
      write_only: true,
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
    assert.strictEqual(res.data.name, 'strain_owners');
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
