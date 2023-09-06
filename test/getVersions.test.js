/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/readVersions.response.js';

describe('#getVersions', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let versions;

  const scope = nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version')
    .reply(200, response.readVersions);

  beforeEach(async () => {
    versions = await fastly.getVersions();
  });

  it('active version should be 1', () => {
    assert.strictEqual(versions.active, 1);
  });

  it('latest version should be 2', () => {
    assert.strictEqual(versions.latest, 2);
  });

  it('current version should be 2', () => {
    assert.strictEqual(versions.current, 2);
  });

  after('API has been called once', () => {
    scope.done();
  });
});

describe('#getVersion', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');

  const scope = nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version')
    .reply(200, response.readVersions);

  it('active version should be undefined', async () => {
    assert.strictEqual(await fastly.getVersion(undefined, 'active'), 1);
  });

  it('latest version should be 2', async () => {
    assert.strictEqual(await fastly.getVersion(undefined, 'latest'), 2);
  });

  it('current version should be 2', async () => {
    assert.strictEqual(await fastly.getVersion(undefined, 'current'), 2);
  });

  it('current version should be 2 after fallbacks', async () => {
    assert.strictEqual(await fastly.getVersion(undefined, 'nonsense', 'unknown', 'current', 'initial'), 2);
  });

  it('initial version should be 1 after fallbacks', async () => {
    assert.strictEqual(await fastly.getVersion(undefined, 'nonsense', 'initial', 'current', 'initial'), 1);
  });

  after('API has been called once', () => {
    scope.done();
  });
});
