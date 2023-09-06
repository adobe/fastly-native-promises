/* eslint-env mocha */
import assert from 'assert';
import nock from 'nock';
import config from '../src/config.js';
import fastlyPromises from '../src/index.js';
import response from './response/createVCL.response.js';

describe('#writeVCL', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/version/1/vcl')
    .reply(200, response.createVCL);

  before(async () => {
    res = await fastly.writeVCL('1', { name: 'test-vcl', content: 'backend default {\n  .host = "127.0.0.1";\n  .port = "9092";\n}\n\nsub vcl_recv {\n    set req.backend = default;\n}\n\nsub vcl_hash {\n    set req.hash += req.url;\n    set req.hash += req.http.host;\n    set req.hash += "0";\n}' });
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
    assert.strictEqual(res.data.main, false);
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
