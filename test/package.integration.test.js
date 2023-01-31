/* eslint-env mocha */
import { condit } from '@adobe/helix-testutils';
import nock from 'nock';
import assert from 'assert';
import path from 'path';
import fs from 'fs/promises';
import f from '../src/index.js';

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
    assert.deepStrictEqual(data, {
      created_at: '2023-01-23T10:17:05Z',
      deleted_at: null,
      version: 2,
      metadata: {
        name: 'test-service',
        description: '',
        authors: ['trieloff@adobe.com'],
        language: 'javascript',
        size: 2752418,
        hashsum: 'a4ce30a465198dd72b446e001e803ec609c0f40062fb6277a64c82d4c12cae0b33597306465f03a375c8e817498299560e4580c7844c575254d42dae6ecba742',
      },
      updated_at: '2023-01-23T10:19:58Z',
      id: 'nnBCKkRFX9fEzSVKb6rZ73',
      service_id: 'HcS29amvAoLOMIFvBukYN1',
    });
  }).timeout(5000);

  condit('Update Package', condit.hasenvs(['FASTLY_AUTH_CE', 'FASTLY_CE_SERVICE_ID']), async () => {
    const buffer = await fs.readFile(path.resolve(__testdir, 'compute/pkg/Test.tar.gz'));

    const res = await fastly.writePackage(3, buffer);
    assert.deepStrictEqual(res.data.metadata, {
      name: 'Test',
      description: 'Test Project',
      authors: ['Lars Trieloff'],
      language: 'javascript',
      size: 2735861,
      hashsum: '22c0a39699a3743001c8de6fc9a9422ac1dac13e9204b80d7f5ec3988a362e7eb3d589cd2a472edded08b712fb9ddf0fffec60642e6361fb5e16e28fc00b2e17',
    });
  }).timeout(60000);
});
