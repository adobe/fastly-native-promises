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
      created_at: '2023-09-05T12:05:15Z',
      deleted_at: null,
      version: 2,
      metadata: {
        name: 'Test Service 2 for Fastly Native Promises',
        description: 'Test Service 2 for Fastly Native Promises',
        files_hash: '18dce82b1924155da7183943eee276cc556b9bc92f3ef25d813f69649c371a16239d2e22bfda1df02c0de0539a1ea7c05c01ec951651849ade234a8c31b2d908',
        authors: ['bosschae@adobe.com'],
        language: 'javascript',
        size: 5118629,
        hashsum: '999c7c767484b285378429cc3e02e68564142b46ed76d3d375367b5b37f12903f444ffa73ee552ab5052cb91884c5c9ddc3cc4d00bfc4eaf4ebbc3b924704726',
      },
      updated_at: '2023-09-06T09:49:12Z',
      id: 'qFeBJHlwkqLYJtWijGjqb1',
      service_id: 'Jc28E3W2ESYMwXi9fRe2Z5',
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
      files_hash: 'a24353ecf54c2be005f3dea934a50e62916d829b62c16041f991cc1abbf9687a0836ec55b8c97d70b028b48a710b85a78b27c2a930a19cfbe946fb108a2eb657',
      hashsum: '22c0a39699a3743001c8de6fc9a9422ac1dac13e9204b80d7f5ec3988a362e7eb3d589cd2a472edded08b712fb9ddf0fffec60642e6361fb5e16e28fc00b2e17',
    });
  }).timeout(60000);
});
