/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';

import getversionsresponse from './response/readVersions.response.js';
import response from './response/activateVersion.response.js';

describe('#activateVersion.default', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version')
    .reply(200, getversionsresponse.readVersions)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/2/activate')
    .reply(200, response.activateVersionDefault);

  before(async () => {
    res = await fastly.activateVersion();
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

  it('response body property should be true', () => {
    assert.strictEqual(res.data.number, 3);
    assert.ok(res.data.active);
  });

  it('active version is 3', async () => {
    assert.strictEqual((await fastly.getVersions()).active, 3);
  });

  it('response body should contain all properties', () => {
    [
      'testing',
      'locked',
      'number',
      'active',
      'service_id',
      'staging',
      'created_at',
      'deleted_at',
      'comment',
      'updated_at',
      'deployed',
      'msg',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
