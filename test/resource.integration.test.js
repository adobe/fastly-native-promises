/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';

import f from '../src/index.js';
import { condit } from './utils.js';

describe('#integration resource linking operations', () => {
  let fastly;
  let testSecretStoreId;
  let testConfigStoreId;
  const testSecretStoreName = `test-resource-secret-${Date.now()}`;
  const testConfigStoreName = `test-resource-config-${Date.now()}`;

  before(() => {
    nock.restore();
    fastly = f(process.env.FASTLY_AUTH, process.env.FASTLY_SERVICE_ID);
  });

  after(() => {
    nock.activate();
  });

  afterEach(() => {
    Object.values(fastly.requestmonitor.stats).forEach((val) => {
      if (!Number.isNaN(val)) {
        assert.ok(val > 0);
      }
    });
  });

  condit('Setup: Create Secret Store for Resource Linking', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const res = await fastly.createSecretStore(testSecretStoreName);
    assert.ok(res.data);
    testSecretStoreId = res.data.id;
  }).timeout(10000);

  condit('Setup: Create Config Store for Resource Linking', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const res = await fastly.createConfigStore(testConfigStoreName);
    assert.ok(res.data);
    testConfigStoreId = res.data.id;
  }).timeout(10000);

  condit('Link Secret Store to Service Version', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testSecretStoreId, 'Secret Store ID should be set');

    await fastly.transact(async (version) => {
      const res = await fastly.writeResource(version, testSecretStoreId, 'test_secrets');
      assert.ok(res.data);
      assert.strictEqual(res.data.name, 'test_secrets');
      assert.strictEqual(res.data.resource_id, testSecretStoreId);
    }, false);
  }).timeout(15000);

  condit('Link Config Store to Service Version', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testConfigStoreId, 'Config Store ID should be set');

    await fastly.transact(async (version) => {
      const res = await fastly.writeResource(version, testConfigStoreId, 'test_config');
      assert.ok(res.data);
      assert.strictEqual(res.data.name, 'test_config');
      assert.strictEqual(res.data.resource_id, testConfigStoreId);
    }, false);
  }).timeout(15000);

  condit('Read Resources for Service Version', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    const res = await fastly.readResources(version);
    assert.ok(res.data);
    assert.ok(Array.isArray(res.data));

    const secretResource = res.data.find((r) => r.resource_id === testSecretStoreId);
    assert.ok(secretResource, 'Secret store resource link should exist');
    assert.strictEqual(secretResource.name, 'test_secrets');

    const configResource = res.data.find((r) => r.resource_id === testConfigStoreId);
    assert.ok(configResource, 'Config store resource link should exist');
    assert.strictEqual(configResource.name, 'test_config');
  }).timeout(10000);

  condit('Read Specific Resource Link', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testSecretStoreId, 'Secret Store ID should be set');
    const version = await fastly.getVersion(undefined, 'current');
    const res = await fastly.readResource(version, testSecretStoreId);
    assert.ok(res.data);
    assert.strictEqual(res.data.resource_id, testSecretStoreId);
    assert.strictEqual(res.data.name, 'test_secrets');
  }).timeout(10000);

  condit('Update Resource Link', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testSecretStoreId, 'Secret Store ID should be set');

    await fastly.transact(async (version) => {
      const res = await fastly.updateResource(version, testSecretStoreId, 'updated_secrets');
      assert.ok(res.data);
      assert.strictEqual(res.data.name, 'updated_secrets');
      assert.strictEqual(res.data.resource_id, testSecretStoreId);
    }, false);
  }).timeout(15000);

  condit('Delete Resource Links', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testSecretStoreId, 'Secret Store ID should be set');
    assert.ok(testConfigStoreId, 'Config Store ID should be set');

    await fastly.transact(async (version) => {
      const res1 = await fastly.deleteResource(version, testSecretStoreId);
      assert.ok(res1.data);

      const res2 = await fastly.deleteResource(version, testConfigStoreId);
      assert.ok(res2.data);
    }, false);
  }).timeout(15000);

  condit('Cleanup: Delete Secret Store', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testSecretStoreId, 'Secret Store ID should be set');
    const res = await fastly.deleteSecretStore(testSecretStoreId);
    assert.ok(res.data);
  }).timeout(10000);

  condit('Cleanup: Delete Config Store', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testConfigStoreId, 'Config Store ID should be set');
    const res = await fastly.deleteConfigStore(testConfigStoreId);
    assert.ok(res.data);
  }).timeout(10000);
});
