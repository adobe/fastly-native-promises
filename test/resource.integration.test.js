/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';

import f from '../src/index.js';
import { condit } from './utils.js';

describe('#integration resource linking operations', () => {
  let fastly;
  let testSecretStoreId;
  let testConfigStoreId;
  const testSecretStoreName = 'test_resource_secret';
  const testConfigStoreName = 'test_resource_config';

  before(async () => {
    nock.restore();
    // Resource linking requires Compute@Edge service
    fastly = f(process.env.FASTLY_AUTH_CE, process.env.FASTLY_CE_SERVICE_ID);

    // Clean up any existing test stores (aggressive cleanup of all test-* stores)
    try {
      const secretStores = await fastly.readSecretStores();
      const testSecretStores = secretStores.data?.data?.filter((s) => s.name.toLowerCase().startsWith('test-')) || [];
      if (testSecretStores.length > 0) {
        const results = await Promise.allSettled(
          testSecretStores.map((store) => fastly.deleteSecretStore(store.id)),
        );
        const failed = results.filter((r) => r.status === 'rejected');
        if (failed.length > 0) {
          // Ignore cleanup failures
        }
      }

      const configStores = await fastly.readConfigStores();
      const testConfigStores = configStores.data?.data?.filter((s) => s.name.toLowerCase().startsWith('test-')) || [];
      if (testConfigStores.length > 0) {
        const results = await Promise.allSettled(
          testConfigStores.map((store) => fastly.deleteConfigStore(store.id)),
        );
        const failed = results.filter((r) => r.status === 'rejected');
        if (failed.length > 0) {
          // Ignore cleanup failures
        }
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  after(async () => {
    // Clean up test stores
    try {
      if (testSecretStoreId) {
        await fastly.deleteSecretStore(testSecretStoreId);
      }
      if (testConfigStoreId) {
        await fastly.deleteConfigStore(testConfigStoreId);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
    nock.activate();
  });

  afterEach(() => {
    Object.values(fastly.requestmonitor.stats).forEach((val) => {
      if (!Number.isNaN(val)) {
        assert.ok(val > 0);
      }
    });
  });

  condit('Resource Linking Operations (Basic Write)', condit.hasenvs(['FASTLY_AUTH_CE', 'FASTLY_CE_SERVICE_ID']), async () => {
    // Create stores for resource linking
    const secretStoreRes = await fastly.createSecretStore(testSecretStoreName);
    assert.ok(secretStoreRes.data);
    const secretStoreId = secretStoreRes.data.id;

    const configStoreRes = await fastly.createConfigStore(testConfigStoreName);
    assert.ok(configStoreRes.data);
    const configStoreId = configStoreRes.data.id;

    try {
      // Test basic resource linking - just write operations
      await fastly.transact(async (version) => {
        // Link Secret Store to Service Version
        const secretLinkRes = await fastly.writeResource(version, secretStoreId, 'test_secrets');
        assert.ok(secretLinkRes.data);
        assert.strictEqual(secretLinkRes.data.name, 'test_secrets');
        assert.strictEqual(secretLinkRes.data.resource_id, secretStoreId);

        // Link Config Store to Service Version
        const configLinkRes = await fastly.writeResource(version, configStoreId, 'test_config');
        assert.ok(configLinkRes.data);
        assert.strictEqual(configLinkRes.data.name, 'test_config');
        assert.strictEqual(configLinkRes.data.resource_id, configStoreId);
      }, false);
    } finally {
      // Cleanup: Delete stores
      try {
        await fastly.deleteSecretStore(secretStoreId);
      } catch (e) {
        // Ignore cleanup errors
      }
      try {
        await fastly.deleteConfigStore(configStoreId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }).timeout(20000);
});
