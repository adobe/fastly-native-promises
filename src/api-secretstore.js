/*
 * Copyright 2025 Adobe. All rights reserved.
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
 * The Fastly Secret Store API for managing secret stores and secrets.
 *
 * @see https://www.fastly.com/documentation/reference/api/services/resources/secret-store/
 * @type {SecretStoreAPI}
 */
export default class SecretStoreAPI {
  constructor(base) {
    Object.assign(this, {
      service_id: base.service_id,
      request: base.request,
    });
  }

  /**
   * List all secret stores.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/secret-store/
   * @returns {Promise} The response object.
   */
  async readSecretStores() {
    return this.request.get('/resources/stores/secret');
  }

  /**
   * Get a specific secret store by ID.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/secret-store/
   * @param {string} storeId - The secret store ID.
   * @returns {Promise} The response object.
   */
  async readSecretStore(storeId) {
    return this.request.get(`/resources/stores/secret/${storeId}`);
  }

  /**
   * Create a new secret store.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/secret-store/
   * @param {string} name - The name of the secret store.
   * @param {object} options - Additional options.
   * @param {boolean} [options.write_only=false] - Whether the store is write-only.
   * @returns {Promise} The response object.
   */
  async createSecretStore(name, options = {}) {
    return this.request.post('/resources/stores/secret', {
      name,
      write_only: options.write_only || false,
    });
  }

  /**
   * Create or get a secret store by name.
   *
   * @param {string} name - The name of the secret store.
   * @param {object} options - Additional options.
   * @returns {Promise} The response object with the store ID.
   */
  async writeSecretStore(name, options = {}) {
    try {
      const stores = await this.readSecretStores();
      const existing = stores.data?.data?.find((s) => s.name === name);
      if (existing) {
        return { data: existing };
      }
    } catch (e) {
      // If listing fails, try to create anyway
    }
    return this.createSecretStore(name, options);
  }

  /**
   * Delete a secret store.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/secret-store/
   * @param {string} storeId - The secret store ID.
   * @returns {Promise} The response object.
   */
  async deleteSecretStore(storeId) {
    return this.request.delete(`/resources/stores/secret/${storeId}`);
  }

  /**
   * List all secrets in a store (returns metadata only, not secret values).
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/secret-store/
   * @param {string} storeId - The secret store ID.
   * @returns {Promise} The response object.
   */
  async readSecrets(storeId) {
    return this.request.get(`/resources/stores/secret/${storeId}/secrets`);
  }

  /**
   * Get metadata for a specific secret (does not return the secret value).
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/secret-store/
   * @param {string} storeId - The secret store ID.
   * @param {string} secretName - The secret name.
   * @returns {Promise} The response object.
   */
  async readSecret(storeId, secretName) {
    return this.request.get(`/resources/stores/secret/${storeId}/secrets/${encodeURIComponent(secretName)}`);
  }

  /**
   * Create or update a secret in a store.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/secret-store/
   * @param {string} storeId - The secret store ID.
   * @param {string} secretName - The secret name.
   * @param {string} secretValue - The secret value.
   * @returns {Promise} The response object.
   */
  async putSecret(storeId, secretName, secretValue) {
    return this.request.put(`/resources/stores/secret/${storeId}/secrets`, {
      name: secretName,
      secret: secretValue,
    });
  }

  /**
   * Delete a secret from a store.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/secret-store/
   * @param {string} storeId - The secret store ID.
   * @param {string} secretName - The secret name.
   * @returns {Promise} The response object.
   */
  async deleteSecret(storeId, secretName) {
    return this.request.delete(`/resources/stores/secret/${storeId}/secrets/${encodeURIComponent(secretName)}`);
  }
}
