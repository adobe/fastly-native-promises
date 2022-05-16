'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/createBackend.response');

describe('#createBackend', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/version/1/backend')
    .reply(200, response.createBackend);

  before(async () => {
    res = await fastly.createBackend(1, {
      ipv4: '127.0.0.1',
      name: 'backend-name',
      port: 80,
    });
  });

  it('response should be a status 200', () => {
    assert.strictEqual(res.status, 200);
  });

  it('response body should exist', () => {
    assert.ok(res.data);
  });

  it('response body should be an object', () => {
    assert.strictEqual(typeof res.data, 'object');
  });

  it('response body properties should be created', () => {
    assert.strictEqual(res.data.name, 'backend-name');
    assert.strictEqual(res.data.port, 80);
    assert.strictEqual(res.data.ipv4, '127.0.0.1');
  });

  it('response body should contain all properties', () => {
    [
      'address',
      'auto_loadbalance',
      'between_bytes_timeout',
      'client_cert',
      'comment',
      'connect_timeout',
      'error_threshold',
      'first_byte_timeout',
      'healthcheck',
      'hostname',
      'ipv4',
      'ipv6',
      'locked',
      'max_conn',
      'max_tls_version',
      'min_tls_version',
      'name',
      'port',
      'request_condition',
      'service_id',
      'shield',
      'override_host',
      'ssl_ca_cert',
      'ssl_cert_hostname',
      'ssl_check_cert',
      'ssl_ciphers',
      'ssl_client_cert',
      'ssl_client_key',
      'ssl_hostname',
      'ssl_sni_hostname',
      'use_ssl',
      'version',
      'weight',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
