/* eslint-env mocha */
process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
const nock = require('nock');
const assert = require('assert');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/condition.response');
const bodymatch = require('./bodymatch');

describe('#fastly.conditions.update', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let map;

  const scope = nock(config.mainEntryPoint)
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
    .reply(200, response.post2);

  before(async () => {
    map = await fastly.conditions.update(
      1,
      'REQUEST',
      'Created by fastly-native-promises #test',
      'test',
    )('req.url.basename == "new.html"', 'req.url.basename == "index.html"');
  });

  it('Returns a map', () => {
    assert.strictEqual(typeof map, 'object');
  });

  it('Creates stable hashes', () => {
    assert.strictEqual(map['req.url.basename == "new.html"'].name, 'test-5d02ca762cb6470172b3fd92c21d15e5b0e44925');
  });

  it('All requests have been made', () => {
    scope.done();
  });

  it('Creates stable hashes', () => {
    assert.strictEqual(map['req.url.basename == "new.html"'].name, 'test-5d02ca762cb6470172b3fd92c21d15e5b0e44925');
  });
});
