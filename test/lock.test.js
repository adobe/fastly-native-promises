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
import { Lock } from '../src/lock.js';

describe('Lock Tests', () => {
  it('Lock can be acquired and released', async () => {
    const lock = new Lock();
    await lock.acquire();
    assert.ok(lock);
    lock.release();
    assert.ok(lock);
  });

  it('Lock can be acquired and released multiple times', async () => {
    const lock = new Lock();
    await lock.acquire();
    assert.ok(lock);
    lock.release();
    assert.ok(lock);

    await lock.acquire();
    assert.ok(lock);
    lock.release();
    assert.ok(lock);
  });

  it('Lock leads to sequential execution', async () => {
    async function wait(millis) {
      return new Promise((resolve) => {
        setTimeout(resolve, millis);
      });
    }

    let counter = 0;
    const lock = new Lock();

    async function run() {
      await lock.acquire();
      assert.equal(counter, 0);
      counter += 1;
      await wait(500);
      counter -= 1;
      lock.release();
    }

    await Promise.all([run(), run(), run()]);
  });
});
