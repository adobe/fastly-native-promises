/* eslint-env mocha */
import nock from 'nock';
import assert from 'assert';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/setMainVCL.response.js';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
describe('#setMainVCL', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/1/vcl/test-vcl/main')
    .reply(200, response.setMainVCL);

  before(async () => {
    res = await fastly.setMainVCL('1', 'test-vcl');
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
    assert.strictEqual(res.data.name, 'test-vcl');
    assert.strictEqual(res.data.main, true);
    assert.strictEqual(res.data.content, 'backend default {\n  .host = "127.0.0.1";\n  .port = "9092";\n}\n\nsub vcl_recv {\n    set req.backend = default;\n}\n\nsub vcl_hash {\n    set req.hash += req.url;\n    set req.hash += req.http.host;\n    set req.hash += "0";\n}');
  });

  it('response body should contain all properties', () => {
    [
      'name',
      'content',
      'main',
      'service_id',
      'version',
    ].forEach((e) => {
      assert.ok(Object.keys(res.data).indexOf(e) >= 0);
    });
  });
});
