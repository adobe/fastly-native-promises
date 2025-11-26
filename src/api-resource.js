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
 * The Fastly Resource API for linking resources (secret stores, config stores,
 * KV stores) to service versions.
 *
 * @see https://www.fastly.com/documentation/reference/api/services/resource/
 * @type {ResourceAPI}
 */
export default class ResourceAPI {
  constructor(base) {
    Object.assign(this, {
      service_id: base.service_id,
      request: base.request,
      getVersion: base.getVersion,
    });
  }

  /**
   * List all resources linked to a service version.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resource/
   * @param {string} version - The service version.
   * @returns {Promise} The response object.
   */
  async readResources(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/resource`);
  }

  /**
   * Get a specific resource link.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resource/
   * @param {string} version - The service version.
   * @param {string} resourceId - The resource ID.
   * @returns {Promise} The response object.
   */
  async readResource(version, resourceId) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/resource/${resourceId}`);
  }

  /**
   * Link a resource (secret store, config store, KV store) to a service version.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resource/
   * @param {string} version - The service version.
   * @param {string} resourceId - The resource ID to link.
   * @param {string} name - The name for the resource link (used in Compute applications).
   * @returns {Promise} The response object.
   */
  async writeResource(version, resourceId, name) {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/resource`, {
      name,
      resource_id: resourceId,
    });
  }

  /**
   * Create a resource link. Alias for writeResource.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resource/
   * @param {string} version - The service version.
   * @param {string} resourceId - The resource ID to link.
   * @param {string} name - The name for the resource link.
   * @returns {Promise} The response object.
   */
  async createResource(version, resourceId, name) {
    return this.writeResource(version, resourceId, name);
  }

  /**
   * Update a resource link.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resource/
   * @param {string} version - The service version.
   * @param {string} resourceId - The resource ID.
   * @param {string} name - The new name for the resource link.
   * @returns {Promise} The response object.
   */
  async updateResource(version, resourceId, name) {
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/resource/${resourceId}`, {
      name,
    });
  }

  /**
   * Unlink a resource from a service version.
   *
   * @see https://www.fastly.com/documentation/reference/api/services/resource/
   * @param {string} version - The service version.
   * @param {string} resourceId - The resource ID to unlink.
   * @returns {Promise} The response object.
   */
  async deleteResource(version, resourceId) {
    return this.request.delete(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/resource/${resourceId}`);
  }
}
