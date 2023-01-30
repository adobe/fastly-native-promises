/* eslint-env mocha */
import assert from 'assert';
import config from '../src/config.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#mainEntryPoint', () => {
  it('property should exist', () => {
    assert.ok(config.mainEntryPoint);
  });

  it('property should be a string', () => {
    assert.strictEqual(typeof config.mainEntryPoint, 'string');
  });
});
