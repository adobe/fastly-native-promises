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

/**
 * @typedef {object} PurgeResponse
 * @property {string} status - The status of the purge operation.
 * @property {string} id - The unique identifier for the purge request.
 */

/**
 * @typedef {object} BulkPurgeResponse
 * @property {string} status - The status of the bulk purge operation.
 * @property {string} id - The unique identifier for the bulk purge request.
 */

/**
 * The Fastly Purge API.
 *
 * @see https://docs.fastly.com/api/purge#purge
 * @type {PurgeAPI}
 */
export default class PurgeAPI {
  constructor(base) {
    Object.assign(this, {
      service_id: base.service_id,
      request: base.request,
    });
  }

  /**
   * Instant Purge an individual URL.
   *
   * @see https://docs.fastly.com/api/purge#purge_3aa1d66ee81dbfed0b03deed0fa16a9a
   * @param {string} url - The URL to purge.
   * @returns {Promise<PurgeResponse>} Purge confirmation for the individual URL.
   * @example
   * instance.purgeIndividual('www.example.com')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   */
  async purgeIndividual(url) {
    return this.request.post(`/purge/${url}`);
  }

  /**
   * Instant Purge everything from a service.
   *
   * @see https://docs.fastly.com/api/purge#purge_bee5ed1a0cfd541e8b9f970a44718546
   * @returns {Promise<BulkPurgeResponse>} Confirmation that all content for the service
   *   has been purged.
   * @example
   * instance.purgeAll()
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   */
  async purgeAll() {
    return this.request.post(`/service/${this.service_id}/purge_all`);
  }

  /**
   * Instant Purge a particular service of items tagged with a Surrogate Key.
   *
   * @see https://docs.fastly.com/api/purge#purge_d8b8e8be84c350dd92492453a3df3230
   * @param {string} key - The surrogate key to purge.
   * @returns {Promise<PurgeResponse>} Purge confirmation for the surrogate key.
   * @example
   * instance.purgeKey('key_1')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   */
  async purgeKey(key) {
    return this.request.post(`/service/${this.service_id}/purge/${key}`);
  }

  /**
   * Instant Purge a particular service of items tagged with Surrogate Keys in a batch.
   *
   * @see https://docs.fastly.com/api/purge#purge_db35b293f8a724717fcf25628d713583
   * @param {Array} keys - The array of surrogate keys to purge.
   * @returns {Promise<BulkPurgeResponse>} Confirmation that all content tagged with the
   *   specified surrogate keys has been purged.
   * @example
   * instance.purgeKeys(['key_2', 'key_3', 'key_4'])
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   */
  async purgeKeys(keys) {
    return this.request.post(`/service/${this.service_id}/purge`, {
      surrogate_keys: keys,
    }, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  /**
   * Soft Purge an individual URL.
   *
   * @see https://docs.fastly.com/api/purge#soft_purge_0c4f56f3d68e9bed44fb8b638b78ea36
   * @param {string} url - The URL to soft purge.
   * @returns {Promise<PurgeResponse>} Soft purge confirmation for the individual URL.
   * @example
   * instance.softPurgeIndividual('www.example.com/images')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   */
  async softPurgeIndividual(url) {
    return this.request.post(`/purge/${url}`, undefined, {
      headers: { 'Fastly-Soft-Purge': 1 },
    });
  }

  /**
   * Soft Purge a particular service of items tagged with a Surrogate Key.
   *
   * @see https://docs.fastly.com/api/purge#soft_purge_2e4d29085640127739f8467f27a5b549
   * @param {string} key - The surrogate key to soft purge.
   * @returns {Promise<PurgeResponse>} Soft purge confirmation for the surrogate key.
   * @example
   * instance.softPurgeKey('key_5')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   */
  async softPurgeKey(key) {
    return this.request.post(`/service/${this.service_id}/purge/${key}`, undefined, {
      headers: { 'Fastly-Soft-Purge': 1 },
    });
  }

  /**
   * Soft Purge a particular service of items tagged with Surrogate Keys in a batch.
   *
   * @see https://docs.fastly.com/api/purge#purge_db35b293f8a724717fcf25628d713583
   * @param {Array} keys - The array of surrogate keys to purge.
   * @returns {Promise<BulkPurgeResponse>} Confirmation that all content tagged with the
   *   specified surrogate keys has been soft purged.
   * @example
   * instance.softPurgeKeys(['key_2', 'key_3', 'key_4'])
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   */
  async softPurgeKeys(keys) {
    return this.request.post(`/service/${this.service_id}/purge`, {
      surrogate_keys: keys,
    }, {
      headers: {
        'Fastly-Soft-Purge': 1,
        'content-type': 'application/json',
      },
    });
  }
}
