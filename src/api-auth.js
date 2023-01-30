/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { axiosCreate } from './httpclient.js';
import config from './config.js';

/**
 * The Fastly Auth API.
 *
 * @see https://docs.fastly.com/api/auth#top
 * @type {AuthAPI}
 */
export default class AuthAPI {
  constructor(base) {
    this.base = base;
    this.defaultOptions = {
      baseURL: config.mainEntryPoint,
      timeout: 15000,
      headers: {},
    };
  }

  get request() {
    return this.base.request;
  }

  /**
   * List all tokens of a customer.
   *
   * @see https://docs.fastly.com/api/auth#tokens_d59ff8612bae27a2317278abb048db0c
   * @param {string} [customerId] - The id of the customer.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async readTokens(customerId = '') {
    if (customerId) {
      return this.request.get(`/customer/${customerId}/tokens`);
    }
    return this.request.get('/tokens');
  }

  /**
   * Get the token with the specified id. If the Id is missing, the self token is returned.
   *
   * @see https://docs.fastly.com/api/auth#tokens_bb00e7ed542cbcd7f32b5c908b8ce244
   * @param {string} [id] - The token id.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async readToken(id) {
    if (!id) {
      return this.request.get('/tokens/self');
    }
    const ret = await this.request.get('/tokens');
    const filtered = ret.data.filter((token) => token.id === id);
    if (filtered.length > 0) {
      [ret.data] = filtered;
      return ret;
    }
    throw Error('No such token.');
  }

  /**
   * Delete the token with the specified id.
   *
   * @see https://docs.fastly.com/api/auth#tokens_4a958ba69402500937f0d8570f7ce86f
   * @param {string} [id] - The token id.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async deleteToken(id) {
    return this.request.delete(`/tokens/${id}`);
  }

  /**
   * Create an API token.
   *
   * @see https://docs.fastly.com/api/auth#tokens_db4655a45a0107448eb0676577446e40
   * @param {object} options - The token options.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async createToken(options) {
    // send POST w/o authentication.
    const rp = axiosCreate({ ...this.defaultOptions });
    return rp.post('/tokens', options, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
