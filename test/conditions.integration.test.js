/* eslint-env mocha */
import assert from 'assert';
import { condit } from '@adobe/helix-testutils';
import nock from 'nock';
import f from '../src/index.js';

describe('#integration condition updates', () => {
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
        assert.ok(val > 0);
      }
    });
  });

  condit('Create, Update, Delete Condition', condit.hasenvs(['FASTLY_AUTH', 'FASTLY_SERVICE_ID']), async () => {
    await fastly.transact(async (version) => {
      await fastly.createCondition(version, {
        name: 'test_condition',
        type: 'request',
        statement: 'req.url.basename == "new.html"',
      });

      await fastly.updateCondition(version, 'test_condition', {
        name: 'test_condition',
        type: 'request',
        statement: 'req.url.basename == "old.html"',
      });

      await fastly.deleteCondition(version, 'test_condition');
    }, false);
  }).timeout(5000);
});
