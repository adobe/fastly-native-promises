/* eslint-env mocha */
process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
const nock = require('nock');
const assert = require('assert');
const httpclient = require('../src/httpclient');

describe('#httpclient.caches', () => {
  it('Status 200 can get cached', async () => {
    const scope = nock('http://www.example.com/')
      .get('/foo')
      .reply(200, 'first')
      .get('/foo')
      .reply(200, 'second');

    const client = httpclient.create({
      baseURL: 'http://www.example.com',
      headers: {},
      timeout: 1000,
    });

    const first = await client.get('/foo');
    const second = await client.get('/foo');

    assert.strictEqual(first.data, second.data);
    assert.ok(!scope.isDone());
  });

  it('Status 200 can return JSON', async () => {
    nock('http://www.example.com/')
      .get('/json')
      .reply(200, '{"foo": "bar"}');

    const client = httpclient.create({
      baseURL: 'http://www.example.com',
      headers: {},
      timeout: 1000,
    });

    const first = await client.get('/json');

    assert.deepStrictEqual(first.data, { foo: 'bar' });
  });

  it('Status 404 will not get cached', async () => {
    const scope = nock('http://www.example.com/')
      .get('/bar')
      .reply(404, 'foo')
      .get('/bar')
      .reply(200, 'second');

    const client = httpclient.create({
      baseURL: 'http://www.example.com',
      headers: {},
      timeout: 1000,
    });

    try {
      const first = await client.get('/bar');
      assert.strictEqual(first, undefined);
    } catch (e) {
      assert.strictEqual(e.name, 'FastlyError');
    }
    const second = await client.get('/bar');
    assert.strictEqual(second.data, 'second');

    assert.ok(scope.isDone());
  });
});

describe('#httpclient.retries', () => {
  it('Error 429 triggers a retry', async () => {
    const scope = nock('http://www.example.com/')
      .get('/')
      .reply(429)
      .get('/')
      .reply(429)
      .get('/')
      .reply(200, 'thanks for trying again');

    const client = httpclient.create({
      baseURL: 'http://www.example.com',
      headers: {},
      timeout: 1000,
    });

    const res = await client.get('/');
    assert.strictEqual(res.data, 'thanks for trying again');

    assert.ok(scope.isDone());
  });

  it('Hard errors trigger a retry', async () => {
    const scope = nock('http://www.example.com/')
      .get('/bang')
      .replyWithError('nope')
      .get('/bang')
      .replyWithError('still nope')
      .get('/bang')
      .reply(200, 'thanks for trying again');

    const client = httpclient.create({
      baseURL: 'http://www.example.com',
      headers: {},
      timeout: 1000,
    });

    const res = await client.get('/bang');
    assert.strictEqual(res.data, 'thanks for trying again');

    assert.ok(scope.isDone());
  });

  it('Error 502 and 503 trigger a retry', async () => {
    const scope = nock('http://www.example.com/')
      .get('/gateway')
      .reply(502)
      .get('/gateway')
      .reply(503)
      .get('/gateway')
      .reply(200, 'thanks for trying again');

    const client = httpclient.create({
      baseURL: 'http://www.example.com',
      headers: {},
      timeout: 1000,
    });

    const res = await client.get('/gateway');
    assert.strictEqual(res.data, 'thanks for trying again');

    assert.ok(scope.isDone());
  });

  it('Error 500 does not trigger a reply', async () => {
    const scope = nock('http://www.example.com/')
      .get('/boom')
      .reply(500, '500');

    const client = httpclient.create({
      baseURL: 'http://www.example.com',
      headers: {},
      timeout: 1000,
    });

    try {
      await client.get('/boom');
      assert.fail();
    } catch (e) {
      assert.ok(scope.isDone());
    }
  });
});
