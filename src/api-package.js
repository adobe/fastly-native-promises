/*
 * Copyright 2021 Adobe. All rights reserved.
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
 * The Fastly Package API used for reading and updating Compute(at)Edge packages.
 *
 * @see https://docs.fastly.com/api/config#domain
 * @type {PackageAPI}
 */
export default class PackageAPI {
  constructor(base) {
    Object.assign(this, {
      service_id: base.service_id,
      request: base.request,
      getVersion: base.getVersion,
    });
  }

  /**
   * Get metadata about a package. The metadata is extracted from the package contents.
   *
   * @param {string} version - The current version of a service.
   * @returns {Promise} The response object.
   */
  async readPackage(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/package`);
  }

  /**
   * Upload a new package version. The package is a Buffer of a ZIP file containing the
   * manifest as well as the main WASM file.
   *
   * @param {string} version - The service version to update.
   * @param {Buffer} buffer - The package contents as a Buffer.
   * @returns {Promise} The response object.
   */
  async writePackage(version, buffer) {
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/package`, buffer);
  }
}
