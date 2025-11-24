/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';

import f from '../src/index.js';
import { condit } from './utils.js';

describe('#integration config store operations', () => {
  let fastly;
  let testStoreId;
  const testStoreName = 'test-config-store';

  before(async () => {
    nock.restore();
    fastly = f(process.env.FASTLY_AUTH, process.env.FASTLY_SERVICE_ID);

    // Clean up any existing test stores (aggressive cleanup of all test-* stores)
    try {
      const stores = await fastly.readConfigStores();
      const allStores = stores.data?.data || [];
      console.log(`Total config stores: ${allStores.length}`, allStores.map((s) => s.name));
      const testStores = allStores.filter((s) => s.name.toLowerCase().startsWith('test-'));
      console.log(`Found ${testStores.length} test config stores to clean up`, testStores.map((s) => s.name));
      if (testStores.length > 0) {
        const results = await Promise.allSettled(
          testStores.map((store) => fastly.deleteConfigStore(store.id)),
        );
        const failed = results.filter((r) => r.status === 'rejected');
        if (failed.length > 0) {
          console.log(`Failed to delete ${failed.length} config stores`, failed.map((r) => r.reason?.message));
        }
      }
    } catch (e) {
      console.log('Error during config store cleanup:', e.message);
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

  condit('Create Config Store', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const res = await fastly.createConfigStore(testStoreName);
    assert.ok(res.data);
    assert.strictEqual(res.data.name, testStoreName);
    assert.ok(res.data.id);
    testStoreId = res.data.id;
  }).timeout(10000);

  condit('Read Config Stores', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const res = await fastly.readConfigStores();
    assert.ok(res.data);
    assert.ok(res.data.data);
    assert.ok(Array.isArray(res.data.data));
    const store = res.data.data.find((s) => s.name === testStoreName);
    assert.ok(store);
  }).timeout(10000);

  condit('Read Config Store by ID', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.readConfigStore(testStoreId);
    assert.ok(res.data);
    assert.strictEqual(res.data.id, testStoreId);
    assert.strictEqual(res.data.name, testStoreName);
  }).timeout(10000);

  condit('Write Config Store (create or get)', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const res = await fastly.writeConfigStore(testStoreName);
    assert.ok(res.data);
    assert.strictEqual(res.data.name || res.data.data?.name, testStoreName);
  }).timeout(10000);

  condit('Put Config Item', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.putConfigItem(testStoreId, 'test_key', 'test_value');
    assert.ok(res.data);
    assert.strictEqual(res.data.item_key, 'test_key');
    assert.strictEqual(res.data.item_value, 'test_value');
  }).timeout(10000);

  condit('Read Config Items', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.readConfigItems(testStoreId);
    assert.ok(res.data);
    assert.ok(res.data.data);
    assert.ok(Array.isArray(res.data.data));
    const item = res.data.data.find((i) => i.item_key === 'test_key');
    assert.ok(item);
    assert.strictEqual(item.item_value, 'test_value');
  }).timeout(10000);

  condit('Read Config Item by Key', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.readConfigItem(testStoreId, 'test_key');
    assert.ok(res.data);
    assert.strictEqual(res.data.item_key, 'test_key');
    assert.strictEqual(res.data.item_value, 'test_value');
  }).timeout(10000);

  condit('Update Config Item', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.putConfigItem(testStoreId, 'test_key', 'updated_value');
    assert.ok(res.data);
    assert.strictEqual(res.data.item_key, 'test_key');
    assert.strictEqual(res.data.item_value, 'updated_value');
  }).timeout(10000);

  condit('Put Config Item with Slash', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.putConfigItem(testStoreId, 'some/key', 'some/value');
    assert.ok(res.data);
    assert.strictEqual(res.data.item_key, 'some/key');
    assert.strictEqual(res.data.item_value, 'some/value');
  }).timeout(10000);

  condit('Bulk Update Config Items', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');

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
        testStoreId,
        { item_key: 'bulk_key1', item_value: 'value1', op: 'upsert' },
        { item_key: 'bulk_key2', item_value: 'value2', op: 'upsert' },
        { item_key: 'bulk_key3', item_value: 'value3', op: 'upsert' },
      );
      assert.ok(res1.data);

      // Verify items were created
      const items = await fastly.readConfigItems(testStoreId);
      assert.ok(items.data.data.find((i) => i.item_key === 'bulk_key1'));

      // Bulk update/delete
      const res2 = await fastly.bulkUpdateConfigItems(
        testStoreId,
        { item_key: 'bulk_key1', item_value: 'new_value1', op: 'upsert' },
        { item_key: 'bulk_key2', item_value: 'value2', op: 'delete' },
      );
      assert.ok(res2.data);
    }
  }).timeout(15000);

  condit('Delete Config Item', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.deleteConfigItem(testStoreId, 'test_key');
    assert.ok(res.data);
  }).timeout(10000);

  condit('Delete Config Store', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    assert.ok(testStoreId, 'Store ID should be set from Create test');
    const res = await fastly.deleteConfigStore(testStoreId);
    assert.ok(res.data);
    testStoreId = null; // Clear so after() hook doesn't try to delete again
  }).timeout(10000);
});
