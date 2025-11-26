/* eslint-env mocha */
import assert from 'assert';
import path from 'path';
import fs from 'fs/promises';
import nock from 'nock';
import f from '../src/index.js';
import { condit } from './utils.js';

describe('#integration compute@edge packages', () => {
  let fastly;

  before(() => {
    nock.restore();

    fastly = f(process.env.FASTLY_AUTH_CE, process.env.FASTLY_CE_SERVICE_ID);
  });

  after(() => {
    nock.activate();
  });

  afterEach(() => {
    Object.values(fastly.requestmonitor.stats).forEach((val) => {
      // all stats should be numbers
      if (!Number.isNaN(val)) {
        assert.ok(val > 0);
      }
    });
  });

  condit('Get Package Metadata', condit.hasenvs(['FASTLY_AUTH_CE', 'FASTLY_CE_SERVICE_ID']), async () => {
    const { data } = await fastly.readPackage(2);

    // Check structure and types rather than exact values
    assert.ok(data);
    assert.strictEqual(data.version, 2);
    assert.strictEqual(data.deleted_at, null);
    assert.strictEqual(data.service_id, process.env.FASTLY_CE_SERVICE_ID);

    // Check that required fields exist and have correct types
    assert.ok(typeof data.created_at === 'string');
    assert.ok(typeof data.updated_at === 'string');
    assert.ok(typeof data.id === 'string');

    // Check metadata structure
    assert.ok(data.metadata);
    assert.ok(typeof data.metadata.name === 'string');
    assert.ok(typeof data.metadata.description === 'string');
    assert.ok(typeof data.metadata.hashsum === 'string');
    assert.ok(Array.isArray(data.metadata.authors));
    assert.strictEqual(data.metadata.language, 'javascript');
    assert.ok(typeof data.metadata.size === 'number');
    assert.ok(data.metadata.size > 0);
  }).timeout(5000);

  condit('Update Package', condit.hasenvs(['FASTLY_AUTH_CE', 'FASTLY_CE_SERVICE_ID']), async () => {
    const buffer = await fs.readFile(path.resolve(__testdir, 'compute/pkg/Test.tar.gz'));

    const res = await fastly.writePackage(3, buffer);

    // Check that the package was uploaded successfully
    assert.ok(res.data);
    assert.ok(res.data.metadata);

    // Check metadata structure and types
    const { metadata } = res.data;
    assert.ok(typeof metadata.name === 'string');
    assert.ok(typeof metadata.description === 'string');
    assert.ok(Array.isArray(metadata.authors));
    assert.strictEqual(metadata.language, 'javascript');
    assert.ok(typeof metadata.size === 'number');
    assert.ok(metadata.size > 0);
    assert.ok(typeof metadata.files_hash === 'string');
    assert.ok(typeof metadata.hashsum === 'string');
  }).timeout(10000);
});
