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
 * The Fastly Config Store API for managing config stores and configuration items.
 *
 * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
 * @type {ConfigStoreAPI}
 */
export default class ConfigStoreAPI {
  constructor(base) {
    Object.assign(this, {
      service_id: base.service_id,
      request: base.request,
    });
  }

  /**
   * List all config stores.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
   * @returns {Promise} The response object.
   */
  async readConfigStores() {
    return this.request.get('/resources/stores/config');
  }

  /**
   * Get a specific config store by ID.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
   * @param {string} storeId - The config store ID.
   * @returns {Promise} The response object.
   */
  async readConfigStore(storeId) {
    return this.request.get(`/resources/stores/config/${storeId}`);
  }

  /**
   * Create a new config store.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
   * @param {string} name - The name of the config store.
   * @returns {Promise} The response object.
   */
  async createConfigStore(name) {
    return this.request.post('/resources/stores/config', { name });
  }

  /**
   * Create or get a config store by name.
   *
   * @param {string} name - The name of the config store.
   * @returns {Promise} The response object with the store ID.
   */
  async writeConfigStore(name) {
    try {
      const stores = await this.readConfigStores();
      const existing = stores.data?.data?.find((s) => s.name === name);
      if (existing) {
        return { data: existing };
      }
    } catch (e) {
      // If listing fails, try to create anyway
    }
    return this.createConfigStore(name);
  }

  /**
   * Delete a config store.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
   * @param {string} storeId - The config store ID.
   * @returns {Promise} The response object.
   */
  async deleteConfigStore(storeId) {
    return this.request.delete(`/resources/stores/config/${storeId}`);
  }

  /**
   * List all items in a config store.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
   * @param {string} storeId - The config store ID.
   * @returns {Promise} The response object.
   */
  async readConfigItems(storeId) {
    return this.request.get(`/resources/stores/config/${storeId}/items`);
  }

  /**
   * Get a specific config item.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
   * @param {string} storeId - The config store ID.
   * @param {string} key - The item key.
   * @returns {Promise} The response object.
   */
  async readConfigItem(storeId, key) {
    return this.request.get(`/resources/stores/config/${storeId}/item/${encodeURIComponent(key)}`);
  }

  /**
   * Create or update a config item.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
   * @param {string} storeId - The config store ID.
   * @param {string} key - The item key.
   * @param {string} value - The item value.
   * @returns {Promise} The response object.
   */
  async putConfigItem(storeId, key, value) {
    return this.request.put(`/resources/stores/config/${storeId}/item/${encodeURIComponent(key)}`, {
      item_key: key,
      item_value: value,
    });
  }

  /**
   * Delete a config item.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
   * @param {string} storeId - The config store ID.
   * @param {string} key - The item key.
   * @returns {Promise} The response object.
   */
  async deleteConfigItem(storeId, key) {
    return this.request.delete(`/resources/stores/config/${storeId}/item/${encodeURIComponent(key)}`);
  }

  /**
   * Bulk update config items.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resources/config-store/
   * @param {string} storeId - The config store ID.
   * @param {...object} items - Array of items with {item_key, item_value, op}
   *   where op is 'create', 'update', 'upsert', or 'delete'.
   * @returns {Promise} The response object.
   */
  async bulkUpdateConfigItems(storeId, ...items) {
    return this.request.patch(`/resources/stores/config/${storeId}/items`, { items });
  }
}
