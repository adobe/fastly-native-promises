'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const assert = require('assert');
const fastlyPromises = require('../src/index');

describe('#constructor', () => {
  const instance = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');

  it('class instance should exist', () => {
    assert.ok(instance);
  });

  it('class instance should have service_id and request properties', () => {
    ['service_id', 'request'].forEach((e) => {
      assert.ok(Object.keys(instance).indexOf(e) >= 0);
    });
  });

  it('class instance should have logging functions', () => {
    ['s3',
      's3canary',
      'azureblob',
      'cloudfiles',
      'digitalocean',
      'ftp',
      'bigquery',
      'gcs',
      'honeycomb',
      'logshuttle',
      'logentries',
      'loggly',
      'heroku',
      'openstack',
      'papertrail',
      'scalyr',
      'splunk',
      'sumologic',
      'syslog']
      .map((e) => e.replace(/(^|\s)\S/g, (l) => l.toUpperCase()))
      .forEach((e) => {
        ['read'].forEach((f) => {
          assert.strictEqual(typeof instance[f + e], 'function');
        });
      });
  });

  after('Discard instance', async () => {
    await instance.discard();
  });
});
