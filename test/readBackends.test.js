'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/readBackends.response');

describe('#readBackends', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/234/backend')
    .reply(200, response.readBackends);

  before(async () => {
    res = await fastly.readBackends('234');
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an array', () => {
    assert.strictEqual(Array.isArray(res.data), true);
  });

  it('response body should be an array of objects', () => {
    res.data.forEach((item) => {
      assert.strictEqual(typeof item, 'object');
    });
  });

  it('response body should contain all properties', () => {
    res.data.forEach((item) => {
      [
        'max_tls_version',
        'ssl_client_cert',
        'hostname',
        'error_threshold',
        'first_byte_timeout',
        'client_cert',
        'weight',
        'address',
        'updated_at',
        'connect_timeout',
        'ipv4',
        'ssl_ciphers',
        'name',
        'port',
        'between_bytes_timeout',
        'ssl_client_key',
        'ssl_ca_cert',
        'auto_loadbalance',
        'ssl_check_cert',
        'shield',
        'service_id',
        'request_condition',
        'ssl_cert_hostname',
        'ssl_hostname',
        'ssl_sni_hostname',
        'locked',
        'min_tls_version',
        'ipv6',
        'version',
        'deleted_at',
        'healthcheck',
        'max_conn',
        'use_ssl',
        'created_at',
        'comment',
      ].forEach((e) => {
        assert.ok(Object.keys(item).indexOf(e) >= 0);
      });
    });
  });
});
