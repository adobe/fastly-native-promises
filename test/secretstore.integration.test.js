/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';

import f from '../src/index.js';
import { condit } from './utils.js';

describe('#integration secret store operations', () => {
  let fastly;
  let testStoreId;
  const testStoreName = 'test-secret-store';

  before(async () => {
    nock.restore();
    fastly = f(process.env.FASTLY_AUTH, process.env.FASTLY_SERVICE_ID);

    // Clean up any existing test stores (aggressive cleanup of all test-* stores)
    try {
      const stores = await fastly.readSecretStores();
      const testStores = stores.data?.data?.filter((s) => s.name.startsWith('test-')) || [];
      console.log(`Found ${testStores.length} test secret stores to clean up`);
      if (testStores.length > 0) {
        const results = await Promise.allSettled(
          testStores.map((store) => fastly.deleteSecretStore(store.id)),
        );
        const failed = results.filter((r) => r.status === 'rejected');
        if (failed.length > 0) {
          console.log(`Failed to delete ${failed.length} secret stores`);
        }
      }
    } catch (e) {
      console.log('Error during secret store cleanup:', e.message);
    }
  });

  after(async () => {
    // Clean up test store
    if (testStoreId) {
      try {
        await fastly.deleteSecretStore(testStoreId);
      } catch (e) {
        // Ignore cleanup errors
      }
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

  condit('Create Secret Store', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const res = await fastly.createSecretStore(testStoreName, { write_only: false });
    assert.ok(res.data);
    assert.strictEqual(res.data.name, testStoreName);
    assert.ok(res.data.id);
    testStoreId = res.data.id;
  }).timeout(10000);

  condit('Read Secret Stores', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const res = await fastly.readSecretStores();
    assert.ok(res.data);
    assert.ok(res.data.data);
    assert.ok(Array.isArray(res.data.data));
    const store = res.data.data.find((s) => s.name === testStoreName);
    assert.ok(store);
  }).timeout(10000);

  condit('Read Secret Store by ID', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.readSecretStore(testStoreId);
    assert.ok(res.data);
    assert.strictEqual(res.data.id, testStoreId);
    assert.strictEqual(res.data.name, testStoreName);
  }).timeout(10000);

  condit('Write Secret Store (create or get)', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const res = await fastly.writeSecretStore(testStoreName);
    assert.ok(res.data);
    assert.strictEqual(res.data.name || res.data.data?.name, testStoreName);
  }).timeout(10000);

  condit('Put Secret', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.putSecret(testStoreId, 'test_secret_key', 'test_secret_value');
    assert.ok(res.data);
    assert.strictEqual(res.data.name, 'test_secret_key');
  }).timeout(10000);

  condit('Read Secrets (metadata only)', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.readSecrets(testStoreId);
    assert.ok(res.data);
    assert.ok(res.data.data);
    assert.ok(Array.isArray(res.data.data));
    const secret = res.data.data.find((s) => s.name === 'test_secret_key');
    assert.ok(secret);
    assert.strictEqual(secret.name, 'test_secret_key');
  }).timeout(10000);

  condit('Read Secret (metadata)', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.readSecret(testStoreId, 'test_secret_key');
    assert.ok(res.data);
    assert.strictEqual(res.data.name, 'test_secret_key');
  }).timeout(10000);

  condit('Update Secret', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.putSecret(testStoreId, 'test_secret_key', 'updated_secret_value');
    assert.ok(res.data);
    assert.strictEqual(res.data.name, 'test_secret_key');
    assert.strictEqual(res.data.recreated, true);
  }).timeout(10000);

  condit('Delete Secret', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.deleteSecret(testStoreId, 'test_secret_key');
    assert.ok(res.data);
  }).timeout(10000);

  condit('Delete Secret Store', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.deleteSecretStore(testStoreId);
    assert.ok(res.data);
    testStoreId = null; // Clear so after() hook doesn't try to delete again
  }).timeout(10000);
});
