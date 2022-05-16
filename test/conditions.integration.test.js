/* eslint-env mocha */
process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
const { condit } = require('@adobe/helix-testutils');
const nock = require('nock');
const assert = require('assert');
const f = require('../src/index');

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
