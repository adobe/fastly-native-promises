/* eslint-env mocha */
import assert from 'assert';
import config from '../src/config.js';

describe('#mainEntryPoint', () => {
  it('property should exist', () => {
    assert.ok(config.mainEntryPoint);
  });

  it('property should be a string', () => {
    assert.strictEqual(typeof config.mainEntryPoint, 'string');
  });
});
