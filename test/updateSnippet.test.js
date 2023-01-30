/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/updateSnippet.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#updateSnippet', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/1/snippet/my_snippet')
    .reply(200, response.updateSnippet);

  before(async () => {
    res = await fastly.updateSnippet('1', 'my_snippet', {
      content: 'backend new_backend {}', priority: '10', dynamic: '1', type: 'init',
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
    assert.strictEqual(res.data.type, 'init');
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
