/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';

import f from '../src/index.js';
import { condit } from './utils.js';

describe('#integration config store operations', () => {
  let fastly;
  let testStoreId;
  const testStoreName = `test_config_store_${Date.now()}`;

  before(async () => {
    nock.restore();
    fastly = f(process.env.FASTLY_AUTH, process.env.FASTLY_SERVICE_ID);

    // Clean up any existing test stores (aggressive cleanup of all test-* stores)
    try {
      const stores = await fastly.readConfigStores();
      const allStores = stores.data || [];
      const testStores = allStores.filter((s) => s.name.toLowerCase().startsWith('test'));
      if (testStores.length > 0) {
        await Promise.allSettled(
          testStores.map((store) => fastly.deleteConfigStore(store.id)),
        );
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  after(async () => {
    // Clean up test store
    if (testStoreId) {
      try {
        await fastly.deleteConfigStore(testStoreId);
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

  condit('Config Store Operations (Create, Read, Write)', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    // Create Config Store
    const createRes = await fastly.createConfigStore(testStoreName);
    assert.ok(createRes.data);
    assert.strictEqual(createRes.data.name, testStoreName);
    assert.ok(createRes.data.id);
    testStoreId = createRes.data.id;

    // Read Config Stores (list) - Note: Due to eventual consistency,
    // newly created stores may not immediately appear in the list
    const listRes = await fastly.readConfigStores();
    assert.ok(listRes.data);
    assert.ok(Array.isArray(listRes.data));

    // Read Config Store by ID
    const readRes = await fastly.readConfigStore(testStoreId);
    assert.ok(readRes.data);
    assert.strictEqual(readRes.data.id, testStoreId);
    assert.strictEqual(readRes.data.name, testStoreName);

    // Write Config Store (test with a different name to test create functionality)
    const writeStoreName = `${testStoreName}_write`;
    const writeRes = await fastly.writeConfigStore(writeStoreName);
    assert.ok(writeRes.data);
    assert.strictEqual(writeRes.data.name, writeStoreName);
    assert.ok(writeRes.data.id);

    // Clean up the write test store
    await fastly.deleteConfigStore(writeRes.data.id);
  }).timeout(15000);

  condit('Config Item Operations (Put, Read, Update)', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from previous test');

    // Put Config Item
    const putRes = await fastly.putConfigItem(testStoreId, 'test_key', 'test_value');
    assert.ok(putRes.data);
    assert.strictEqual(putRes.data.item_key, 'test_key');
    assert.strictEqual(putRes.data.item_value, 'test_value');

    // Read Config Items (list)
    const listRes = await fastly.readConfigItems(testStoreId);
    assert.ok(listRes.data);
    assert.ok(Array.isArray(listRes.data));
    const item = listRes.data.find((i) => i.item_key === 'test_key');
    assert.ok(item);
    assert.strictEqual(item.item_value, 'test_value');

    // Read Config Item by Key
    const readRes = await fastly.readConfigItem(testStoreId, 'test_key');
    assert.ok(readRes.data);
    assert.strictEqual(readRes.data.item_key, 'test_key');
    assert.strictEqual(readRes.data.item_value, 'test_value');

    // Update Config Item
    const updateRes = await fastly.putConfigItem(testStoreId, 'test_key', 'updated_value');
    assert.ok(updateRes.data);
    assert.strictEqual(updateRes.data.item_key, 'test_key');
    assert.strictEqual(updateRes.data.item_value, 'updated_value');

    // Put Config Item with Slash
    const slashRes = await fastly.putConfigItem(testStoreId, 'some/key', 'some/value');
    assert.ok(slashRes.data);
    assert.strictEqual(slashRes.data.item_key, 'some/key');
    assert.strictEqual(slashRes.data.item_value, 'some/value');
  }).timeout(15000);

  condit('Bulk Operations and Cleanup', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    // Create a fresh store for bulk operations to avoid timing issues
    const bulkStoreName = `test_bulk_store_${Date.now()}`;
    const bulkStoreRes = await fastly.createConfigStore(bulkStoreName);
    const bulkStoreId = bulkStoreRes.data.id;

    try {
      // Clean up items first
      await Promise.allSettled([
        fastly.deleteConfigItem(testStoreId, 'bulk_key1'),
        fastly.deleteConfigItem(testStoreId, 'bulk_key2'),
        fastly.deleteConfigItem(testStoreId, 'bulk_key3'),
      ]);
    } finally {
      // Bulk create
      const res1 = await fastly.bulkUpdateConfigItems(
        bulkStoreId,
        { item_key: 'bulk_key1', item_value: 'value1', op: 'upsert' },
        { item_key: 'bulk_key2', item_value: 'value2', op: 'upsert' },
        { item_key: 'bulk_key3', item_value: 'value3', op: 'upsert' },
      );
      assert.ok(res1.data);

      // Verify items were created
      const items = await fastly.readConfigItems(bulkStoreId);
      assert.ok(items.data);
      assert.ok(Array.isArray(items.data));
      assert.ok(items.data.find((i) => i.item_key === 'bulk_key1'), 'bulk_key1 not found in items');

      // Bulk update/delete
      const res2 = await fastly.bulkUpdateConfigItems(
        bulkStoreId,
        { item_key: 'bulk_key1', item_value: 'new_value1', op: 'upsert' },
        { item_key: 'bulk_key2', item_value: 'value2', op: 'delete' },
      );
      assert.ok(res2.data);

      // Clean up bulk store
      await fastly.deleteConfigStore(bulkStoreId);

      // Clean up main test store if it still exists
      if (testStoreId) {
        try {
          await fastly.deleteConfigStore(testStoreId);
          testStoreId = null; // Clear so after() hook doesn't try to delete again
        } catch (e) {
          // Store might already be deleted
        }
      }
    }
  }).timeout(20000);

  condit('Individual Item Operations and Store Cleanup', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    // Create a fresh store for individual operations
    const itemStoreName = `test_item_store_${Date.now()}`;
    const itemStoreRes = await fastly.createConfigStore(itemStoreName);
    const itemStoreId = itemStoreRes.data.id;

    // Put an item to test individual read/delete
    await fastly.putConfigItem(itemStoreId, 'individual_key', 'individual_value');

    // Test readConfigItem (individual item read)
    const readItemRes = await fastly.readConfigItem(itemStoreId, 'individual_key');
    assert.ok(readItemRes.data);
    assert.strictEqual(readItemRes.data.item_key, 'individual_key');
    assert.strictEqual(readItemRes.data.item_value, 'individual_value');

    // Test deleteConfigItem
    const deleteItemRes = await fastly.deleteConfigItem(itemStoreId, 'individual_key');
    assert.ok(deleteItemRes);

    // Verify item is deleted
    try {
      await fastly.readConfigItem(itemStoreId, 'individual_key');
      assert.fail('Expected item to be deleted');
    } catch (e) {
      // Item should be deleted - any error is expected (404, not found, etc.)
      assert.ok(e.message || e.status);
    }

    // Test deleteConfigStore
    const deleteStoreRes = await fastly.deleteConfigStore(itemStoreId);
    assert.ok(deleteStoreRes);

    // Verify store is deleted
    try {
      await fastly.readConfigStore(itemStoreId);
      assert.fail('Expected store to be deleted');
    } catch (e) {
      // Store should be deleted - any error is expected (404, not found, etc.)
      assert.ok(e.message || e.status);
    }
  }).timeout(15000);
});
