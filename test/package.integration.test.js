/* eslint-env mocha */
process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
const { condit } = require('@adobe/helix-testutils');
const nock = require('nock');
const assert = require('assert');
const expect = require('expect');
const path = require('path');
const fs = require('fs/promises');
const f = require('../src/index');

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
        expect(val).toBeGreaterThan(0);
      }
    });
  });

  condit('Get Package Metadata', condit.hasenvs(['FASTLY_AUTH_CE', 'FASTLY_CE_SERVICE_ID']), async () => {
    const { data } = await fastly.readPackage(2);
    assert.deepStrictEqual(data, {
      created_at: '2021-06-16T12:53:33Z',
      deleted_at: null,
      version: 2,
      metadata: {
        name: 'js-proto',
        description: 'Early version of a prototype starter kit for experimental JavaScript support for C@E.',
        authors: ['<oss@fastly.com>'],
        language: 'assemblyscript',
        size: 2077176,
        hashsum: '2d3ee7ad885ea597f476a25eed751f52358f8739a5a3aed8e6114a1d0ec60efcc9a63b89418513d38839033d907dd956103748a5fdfbb3cb58bdb98560e11d96',
      },
      updated_at: '2021-06-16T12:53:34Z',
      id: '3RoqPyBrAQBjtMSskwUv51',
      service_id: '1yv1Wl7NQCFmNBkW4L8htc',
    });
  }).timeout(5000);

  condit('Update Package', condit.hasenvs(['FASTLY_AUTH_CE', 'FASTLY_CE_SERVICE_ID']), async () => {
    const buffer = await fs.readFile(path.resolve(__dirname, 'compute/pkg/Test.tar.gz'));

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
