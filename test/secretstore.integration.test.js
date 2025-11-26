/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';

import f from '../src/index.js';
import { condit } from './utils.js';

describe('#integration secret store operations', () => {
  let fastly;
  let testStoreId;
  const testStoreName = 'test_secret_store';

  before(async () => {
    nock.restore();

    fastly = f(process.env.FASTLY_AUTH, process.env.FASTLY_SERVICE_ID);

    // Clean up any existing test stores (aggressive cleanup of all test-* stores)
    try {
      const stores = await fastly.readSecretStores();
      const testStores = stores.data?.data?.filter((s) => s.name.toLowerCase().startsWith('test-')) || [];
      if (testStores.length > 0) {
        const results = await Promise.allSettled(
          testStores.map((store) => fastly.deleteSecretStore(store.id)),
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

  condit('Secret Store Operations (Create, Read, Write)', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    // Create Secret Store
    const createRes = await fastly.createSecretStore(testStoreName);
    assert.ok(createRes.data);
    assert.strictEqual(createRes.data.name, testStoreName);
    assert.ok(createRes.data.id);
    testStoreId = createRes.data.id;

    // Read Secret Store by ID
    const readRes = await fastly.readSecretStore(testStoreId);
    assert.ok(readRes.data);
    assert.strictEqual(readRes.data.id, testStoreId);
    assert.strictEqual(readRes.data.name, testStoreName);

    // Read Secret Stores (list) - Note: Due to eventual consistency,
    // newly created stores may not immediately appear in the list
    const listRes = await fastly.readSecretStores();
    assert.ok(listRes.data);
    assert.ok(listRes.data.data);
    assert.ok(Array.isArray(listRes.data.data));

    // Write Secret Store (test with a different name to test create functionality)
    const writeStoreName = `${testStoreName}_write`;
    const writeRes = await fastly.writeSecretStore(writeStoreName);
    assert.ok(writeRes.data);
    assert.strictEqual(writeRes.data.name, writeStoreName);
    assert.ok(writeRes.data.id);

    // Clean up the write test store
    await fastly.deleteSecretStore(writeRes.data.id);
  }).timeout(15000);

  condit('Secret Operations (Put, Read, Update, Digest Validation)', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from previous test');

    // Put Secret
    const putRes = await fastly.putSecret(testStoreId, 'test_key', 'test_value');
    assert.ok(putRes.data);
    assert.strictEqual(putRes.data.name, 'test_key');
    assert.ok(putRes.data.digest);
    assert.ok(putRes.data.created_at);
    // Secret values should not be returned in responses
    assert.strictEqual(putRes.data.secret, undefined);
    const originalDigest = putRes.data.digest;

    // Read Secrets (list) - metadata only
    const listRes = await fastly.readSecrets(testStoreId);
    assert.ok(listRes.data);
    assert.ok(listRes.data.data);
    assert.ok(Array.isArray(listRes.data.data));
    const secret = listRes.data.data.find((s) => s.name === 'test_key');
    assert.ok(secret);
    assert.strictEqual(secret.name, 'test_key');
    assert.strictEqual(secret.digest, originalDigest);
    // Secret values are not returned in list operations
    assert.strictEqual(secret.secret, undefined);

    // Read Secret (individual) - metadata only
    const readRes = await fastly.readSecret(testStoreId, 'test_key');
    assert.ok(readRes.data);
    assert.strictEqual(readRes.data.name, 'test_key');
    assert.strictEqual(readRes.data.digest, originalDigest);
    // Secret values are not returned in read operations for security
    assert.strictEqual(readRes.data.secret, undefined);

    // Update Secret - should change digest
    const updateRes = await fastly.putSecret(testStoreId, 'test_key', 'updated_value');
    assert.ok(updateRes.data);
    assert.strictEqual(updateRes.data.name, 'test_key');
    assert.strictEqual(updateRes.data.recreated, true);
    assert.ok(updateRes.data.digest);
    // Digest should change when secret value changes
    assert.notStrictEqual(updateRes.data.digest, originalDigest);
  }).timeout(15000);

  condit('Delete Operations and Cleanup', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    // Create a fresh store for delete operations to avoid timing issues
    const cleanupStoreName = `${testStoreName}_cleanup`;
    const storeRes = await fastly.createSecretStore(cleanupStoreName);
    assert.ok(storeRes.data);
    const cleanupStoreId = storeRes.data.id;

    // Create a secret to delete
    const secretRes = await fastly.putSecret(cleanupStoreId, 'delete_test_key', 'delete_test_value');
    assert.ok(secretRes.data);
    assert.strictEqual(secretRes.data.name, 'delete_test_key');

    // Delete the secret
    const deleteSecretRes = await fastly.deleteSecret(cleanupStoreId, 'delete_test_key');
    // Delete operations return empty responses, just check that no error was thrown
    assert.ok(deleteSecretRes);

    // Verify secret is deleted by trying to read it (should fail)
    try {
      await fastly.readSecret(cleanupStoreId, 'delete_test_key');
      assert.fail('Expected secret to be deleted');
    } catch (e) {
      assert.ok(e.message.includes('not found') || e.message.includes('404'));
    }

    // Delete the store
    const deleteStoreRes = await fastly.deleteSecretStore(cleanupStoreId);
    // Delete operations return empty responses, just check that no error was thrown
    assert.ok(deleteStoreRes);

    // Also clean up the main test store
    if (testStoreId) {
      await fastly.deleteSecretStore(testStoreId);
      testStoreId = null;
    }
  }).timeout(15000);
});
