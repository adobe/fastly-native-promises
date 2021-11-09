/* eslint-env mocha */
process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
const { condit } = require('@adobe/helix-testutils');
const nock = require('nock');
const assert = require('assert');
const expect = require('expect');
const { AssertionError } = require('assert');
const f = require('../src/index');

describe('#integration edge dictionary updates', () => {
  let fastly;

  before(() => {
    nock.restore();

    fastly = f(process.env.FASTLY_AUTH, process.env.FASTLY_SERVICE_ID);
  });

  after(() => {
    nock.activate();
  });

  afterEach(() => {
    Object.values(fastly.requestmonitor.stats).forEach((val) => {
      // all stats should be numbers
      if (!Number.isNaN(val)) {
        expect(val).toBeGreaterThan(0);
      }
    });
  });

  condit('Do not create Edge Dictionary due to insufficient limits', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    await expect(fastly.transact(() => {}, false, 2000)).rejects.toThrow();
  }).timeout(5000);

  condit('Create Edge Dictionary', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    await fastly.transact(async (version) => {
      await fastly.writeDictionary(version, 'test_dict', {
        name: 'test_dict',
      });
    }, false);
  }).timeout(5000);

  condit('Create Write-Only Edge Dictionary', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    await fastly.transact(async (version) => {
      await fastly.writeDictionary(version, 'test_wo_dict', {
        name: 'test_wo_dict',
        write_only: true,
      });
    }, false);
  }).timeout(5000);

  condit('Set Edge Dictionary Value', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    await fastly.writeDictItem(version, 'test_dict', 'some_key', 'some_value');
    const val = await fastly.readDictItem(version, 'test_dict', 'some_key');
    assert.deepEqual(val.data.item_value, 'some_value');
  }).timeout(5000);

  condit('Set Edge Dictionary Value with Slash', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    await fastly.writeDictItem(version, 'test_dict', 'some/key', 'some/value');
    const val = await fastly.readDictItem(version, 'test_dict', 'some/key');
    assert.deepEqual(val.data.item_value, 'some/value');
  }).timeout(5000);

  condit('Set Write-Only Edge Dictionary Value', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    await fastly.writeDictItem(version, 'test_wo_dict', 'some_key', 'some_value');
    const val = await fastly.readDictItem(version, 'test_wo_dict', 'some_key');
    assert.deepEqual(val.data.item_value, undefined);
  }).timeout(5000);

  condit('Update Edge Dictionary Value', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    await fastly.writeDictItem(version, 'test_dict', 'some_key', 'some_old_value');
    await fastly.writeDictItem(version, 'test_dict', 'some_key', 'some_new_value');
    const val = await fastly.readDictItem(version, 'test_dict', 'some_key');
    assert.deepEqual(val.data.item_value, 'some_new_value');
  }).timeout(10000);

  condit('Update Edge Dictionary Value with Slash', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    await fastly.writeDictItem(version, 'test_dict', 'some/key', 'some_old_value');
    await fastly.writeDictItem(version, 'test_dict', 'some/key', 'some_new_value');
    const val = await fastly.readDictItem(version, 'test_dict', 'some/key');
    assert.deepEqual(val.data.item_value, 'some_new_value');
  }).timeout(10000);

  condit('Update Write-Only Edge Dictionary Value', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    await fastly.writeDictItem(version, 'test_wo_dict', 'some_key', 'some_old_value');
    await fastly.writeDictItem(version, 'test_wo_dict', 'some_key', 'some_new_value');
    const val = await fastly.readDictItem(version, 'test_wo_dict', 'some_key');
    assert.deepEqual(val.data.item_value, undefined);
  }).timeout(10000);

  condit('Delete Edge Dictionary Value', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    await fastly.writeDictItem(version, 'test_dict', 'some_new_key', 'some_old_value');
    await fastly.writeDictItem(version, 'test_dict', 'some_new_key', undefined);
    try {
      await fastly.readDictItem(version, 'test_dict', 'some_new_key');
      assert.fail('This should throw an error');
    } catch (e) {
      if (e instanceof AssertionError) {
        throw e;
      }
      assert.equal(e.status, 404);
    }
  }).timeout(10000);

  condit('Delete Edge Dictionary Value with Slash', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    await fastly.writeDictItem(version, 'test_dict', 'some/new/key', 'some_old_value');
    await fastly.writeDictItem(version, 'test_dict', 'some/new/key', undefined);
    try {
      await fastly.readDictItem(version, 'test_dict', 'some/new/key');
      assert.fail('This should throw an error');
    } catch (e) {
      if (e instanceof AssertionError) {
        throw e;
      }
      assert.equal(e.status, 404);
    }
  }).timeout(10000);

  condit('Delete Write-Only Edge Dictionary Value', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');
    await fastly.writeDictItem(version, 'test_wo_dict', 'some_new_key', 'some_old_value');
    await fastly.writeDictItem(version, 'test_wo_dict', 'some_new_key', undefined);
    const val = await fastly.readDictItem(version, 'test_wo_dict', 'some_key');
    assert.deepEqual(val.data.item_value, undefined);
  }).timeout(10000);

  condit('Bulk Create/Update/Delete Edge Dictionary Values', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');

    try {
      // clean up the dictionary
      await Promise.all([
        fastly.writeDictItem(version, 'test_dict', 'foo', undefined),
        fastly.writeDictItem(version, 'test_dict', 'bar', undefined),
        fastly.writeDictItem(version, 'test_dict', 'nope', undefined),
        fastly.writeDictItem(version, 'test_dict', 'baz', undefined),
      ]);
    } finally {
    // create fresh
      const res1 = await fastly.bulkUpdateDictItems(
        version,
        'test_dict',
        { item_key: 'foo', item_value: 'one', op: 'create' },
        { item_key: 'bar', item_value: 'two', op: 'create' },
        { item_key: 'nope', item_value: 'three', op: 'create' },
        { item_key: 'baz', item_value: 'four', op: 'upsert' },
      );
      assert.deepEqual(res1.data, { status: 'ok' });

      // update
      const res2 = await fastly.bulkUpdateDictItems(
        version,
        'test_dict',
        { item_key: 'foo', item_value: 'eins', op: 'update' },
        { item_key: 'bar', item_value: 'zwei', op: 'upsert' },
        { item_key: 'nope', item_value: 'three', op: 'delete' },
        { item_key: 'baz', item_value: 'four', op: 'delete' },
      );
      assert.deepEqual(res2.data, { status: 'ok' });

      const val = await fastly.readDictItem(version, 'test_dict', 'bar');
      assert.deepEqual(val.data.item_value, 'zwei');
    }
  }).timeout(15000);

  condit('Bulk Create/Update Write-Only Edge Dictionary Values', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    const version = await fastly.getVersion(undefined, 'current');

    try {
      // clean up the dictionary
      await Promise.all([
        fastly.writeDictItem(version, 'test_wo_dict', 'foo', undefined),
        fastly.writeDictItem(version, 'test_wo_dict', 'bar', undefined),
        fastly.writeDictItem(version, 'test_wo_dict', 'nope', undefined),
        fastly.writeDictItem(version, 'test_wo_dict', 'baz', undefined),
      ]);
    } finally {
    // create fresh
      const res1 = await fastly.bulkUpdateDictItems(
        version,
        'test_wo_dict',
        { item_key: 'foo', item_value: 'one', op: 'create' },
        { item_key: 'bar', item_value: 'two', op: 'create' },
        { item_key: 'nope', item_value: 'three', op: 'create' },
        { item_key: 'baz', item_value: 'four', op: 'upsert' },
      );
      assert.deepEqual(res1.data, { status: 'ok' });

      // update
      const res2 = await fastly.bulkUpdateDictItems(
        version,
        'test_wo_dict',
        { item_key: 'foo', item_value: 'eins', op: 'update' },
        { item_key: 'bar', item_value: 'zwei', op: 'upsert' },
        { item_key: 'nope', item_value: 'three', op: 'delete' },
        { item_key: 'baz', item_value: 'four', op: 'delete' },
      );
      assert.deepEqual(res2.data, { status: 'ok' });
    }
  }).timeout(15000);
});
