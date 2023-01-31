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
 * The Fastly Domain API.
 *
 * @see https://docs.fastly.com/api/config#domain
 * @type {DomainAPI}
 */
export default class DomainAPI {
  constructor(base) {
    Object.assign(this, {
      service_id: base.service_id,
      request: base.request,
      getVersion: base.getVersion,
    });
  }

  /**
   * Checks the status of all domains for a particular service and version.
   *
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the domain.
   * @see https://docs.fastly.com/api/config#domain_30a3f14c9a0ce5730757d39983ab7dc6
   * @returns {Promise} The response object representing the completion or failure.
   */
  async domainCheck(version, name) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/domain/${name}/check`);
  }

  /**
   * Checks the status of all domains for a particular service and version.
   *
   * @param {string} version - The current version of a service.
   * @see https://docs.fastly.com/api/config#domain_e33a599694c3316f00b6b8d53a2db7d9
   * @example
   * instance.domainCheckAll('182')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @returns {Promise} The response object representing the completion or failure.
   */
  async domainCheckAll(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/domain/check_all`);
  }

  /**
   * List all the domains for a particular service and version.
   *
   * @param {string} version - The current version of a service.
   * @see https://docs.fastly.com/api/config#domain_6d340186666771f022ca20f81609d03d
   * @example
   * instance.readDomains('182')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });

   * @returns {Promise} The response object representing the completion or failure.
   */
  async readDomains(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/domain`);
  }

  /**
   * List all the domains for a particular service and version.
   *
   * @param {string} version - The current version of a service.
   * @param {string} name - The domain name.
   * @see https://docs.fastly.com/api/config#domain_f1b5fab17a0729daeeaf7594b47759c5
   * @returns {Promise} The response object representing the completion or failure.
   */
  async readDomain(version, name) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/domain/${name}`);
  }

  /**
   * List the domains within a service.
   *
   * @see https://docs.fastly.com/api/config#service_d5578a1e3bc75512711ddd0a58ce7a36
   * @param {string} [serviceId] - The service id.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async readServiceDomains(serviceId = this.service_id) {
    return this.request.get(`/service/${serviceId}/domain`);
  }

  /**
   * Create a domain for a particular service and version.
   *
   * @see https://docs.fastly.com/api/config#domain_90345101274774ff1b84f0a7dd010b01
   * @param {string} version - The current version of a service.
   * @param {string} name - The domain name.
   * @param {string} comment - Optional comment.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async createDomain(version, name, comment = '') {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/domain`, {
      name,
      comment,
    });
  }

  /**
   * Update a domain for a particular service and version.
   *
   * @see https://docs.fastly.com/api/config#domain_2ef42bd9b4c56c86b46dc0e36096ab10
   * @param {string} version - The current version of a service.
   * @param {string} oldName - The old name of the domain.
   * @param {string} name - The domain name.
   * @param {string} comment - Optional comment.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async updateDomain(version, oldName, name, comment = '') {
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/domain/${oldName}`, {
      name,
      comment,
    });
  }

  /**
   * Delete the domain for a particular service and version.
   *
   * @see https://docs.fastly.com/api/config#domain_aab5a322f58df2b1db8dc276e8594a70
   * @param {string} version - The current version of a service.
   * @param {string} name - The domain name.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async deleteDomain(version, name) {
    return this.request.delete(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/domain/${name}`);
  }
}
