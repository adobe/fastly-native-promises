/* eslint-env mocha */

'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
const assert = require('assert');
const config = require('../src/config');

describe('#mainEntryPoint', () => {
  it('property should exist', () => {
    assert.ok(config.mainEntryPoint);
  });

  it('property should be a string', () => {
    assert.strictEqual(typeof config.mainEntryPoint, 'string');
  });
});
