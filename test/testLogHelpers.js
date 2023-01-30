/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-env mocha */
import assert from 'assert';
import { loghelpers } from '../src/index.js';

const {
  concat, req, res, str, time, toString, vcl,
} = loghelpers;

describe('Schema Helper Integration Tests', () => {
  it('toString works with empty schemas', () => {
    assert.equal(toString({}), '{ }');
  });

  it('toString works with simple schemas', () => {
    assert.equal(toString({
      foo: '%D',
    }), '{ "foo": %D }');
  });

  it('toString works with VCL expressions', () => {
    assert.equal(toString({
      foo: '%D',
      cache_status: str(vcl`regsub(fastly_info.state, "^(HIT-(SYNTH)|(HITPASS|HIT|MISS|PASS|ERROR|PIPE)).*", "\\2\\3")`),
    }), '{ "foo": %D,  "cache_status": "%{json.escape(regsub(fastly_info.state, "^(HIT-(SYNTH)|(HITPASS|HIT|MISS|PASS|ERROR|PIPE)).*", "\\2\\3"))}V" }');
  });

  it('toString works with nested schemas and VCL encoding', () => {
    assert.equal(toString({
      foo: {
        bar: vcl`client.as.number`,
        baz: str(vcl`req.http.X-CDN-Request-ID`),
      },
    }), '{ "foo": { "bar": %{json.escape(client.as.number)}V,  "baz": "%{json.escape(req.http.X-CDN-Request-ID)}V" } }');
  });

  it('toString works with nested schemas and more VCL encoding', () => {
    assert.equal(toString({
      foo: {
        bar: vcl`client.as.number`,
        baz: str(vcl`req.http.X-CDN-Request-ID`),
        method: str('%m'),
        referer: req`Referer`,
        age: res`Age`,
        end: str(
          concat(
            time`end:%Y-%m-%dT%H:%M:%S`,
            '.',
            time`end:msec_frac`,
            time`end:%z`,
          ),
        ),
      },
    }), '{ "foo": { "bar": %{json.escape(client.as.number)}V,  "baz": "%{json.escape(req.http.X-CDN-Request-ID)}V",  "method": "%m",  "referer": "%{Referer}i",  "age": "%{Age}o",  "end": "%{end:%Y-%m-%dT%H:%M:%S}t.%{end:msec_frac}t%{end:%z}t" } }');
  });
});
