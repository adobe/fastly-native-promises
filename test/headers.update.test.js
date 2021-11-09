/* eslint-env mocha */
process.env.HELIX_FETCH_FORCE_HTTP1 = 'false';
const nock = require('nock');
const expect = require('expect');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/condition.response');
const headerresponse = require('./response/header.response');
const bodymatch = require('./bodymatch');

describe('#fastly.headers.update', () => {
  let res;
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/condition')
    .reply(200, response.list)
    .delete('/service/SU1Z0isxPaozGVKXdv0eY/version/1/condition/test-0c5c409c9e6420c233fc157a312660d7070c8e1c')
    .reply(200, response.delete)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/version/1/condition', bodymatch({
      comment: 'Created by fastly-native-promises #test (5d02ca762cb6470172b3fd92c21d15e5b0e44925)',
      name: 'test-5d02ca762cb6470172b3fd92c21d15e5b0e44925',
      priority: '10',
      statement: 'req.url.basename == "new.html"',
      type: 'REQUEST',
    }))
    .reply(200, response.post2)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/header')
    .reply(200, headerresponse.list)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/version/1/header', bodymatch({
      name: 'test-a1a43f0d8ab97e83565a313d5e9db6c5b539a00a',
      priority: '10',
      type: 'request',
      action: 'set',
      dst: 'http.X-Location',
      src: '"https://new.example.com"',
      request_condition: 'test-5d02ca762cb6470172b3fd92c21d15e5b0e44925',
    }))
    .reply(200, headerresponse.post2)
    .delete('/service/SU1Z0isxPaozGVKXdv0eY/version/1/header/test-d03ce3f850b4d5b2c4cfabb4d069e34b1e679b60')
    .reply(200, headerresponse.delete);

  before(async () => {
    await fastly.headers.update(
      1,
      'REQUEST',
      'Created by fastly-native-promises #test',
      'test',
      'set',
      'http.X-Location',
      'request',
    )(
      {
        condition: 'req.url.basename == "new.html"',
        expression: '"https://new.example.com"',
      },
      {
        condition: 'req.url.basename == "index.html"',
        expression: 'https://www.example.com',
      },
    );
  });

  it('All requests have been made', () => {
    expect(res).toBeUndefined();
  });
});
