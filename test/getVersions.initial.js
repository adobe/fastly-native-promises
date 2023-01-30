/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/readVersions.initial.response.js';

describe('#getVersions(inital)', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let versions;

  const scope = nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version')
    .reply(200, response.readVersions);

  beforeEach(async () => {
    versions = await fastly.getVersions();
  });

  it('active version should be undefined', () => {
    assert.strictEqual(versions.active, undefined);
  });

  it('latest version should be 1', () => {
    assert.strictEqual(versions.latest, 1);
  });

  it('current version should be undefined', () => {
    assert.strictEqual(versions.current, undefined);
  });

  after('API has been called once', () => {
    scope.done();
  });
});

describe('#getVersion(initial)', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');

  const scope = nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version')
    .reply(200, response.readVersions);

  it('active version should be undefined', async () => {
    assert.strictEqual(await fastly.getVersion(undefined, 'active'), undefined);
  });

  it('latest version should be 1', async () => {
    assert.strictEqual(await fastly.getVersion(undefined, 'latest'), 1);
  });

  it('current version should be undefined', async () => {
    assert.strictEqual(await fastly.getVersion(undefined, 'current'), undefined);
  });

  it('current version should be 1 after fallbacks', async () => {
    assert.strictEqual(await fastly.getVersion(undefined, 'nonsense', 'active', 'current', 'initial'), 1);
  });

  after('API has been called once', () => {
    scope.done();
  });
});
