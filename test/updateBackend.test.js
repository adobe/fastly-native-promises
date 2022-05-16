'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/updateBackend.response');

describe('#updateBackend', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/12/backend/slow-server')
    .reply(200, response.updateBackend);

  before(async () => {
    res = await fastly.updateBackend('12', 'slow-server', { name: 'fast-server' });
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

  it('response body property should be updated', () => {
    assert.strictEqual(res.data.name, 'fast-server');
  });

  it('response body should contain all properties', () => {
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
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
