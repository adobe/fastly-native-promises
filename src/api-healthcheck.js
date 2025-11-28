/**
 * The Fastly Healthcheck API.
 *
 * @see https://docs.fastly.com/api/config#healthcheck
 * @type {HealthcheckAPI}
 */

/**
 * @typedef {object} Healthcheck
 * @property {string} name - The name of the healthcheck.
 * @property {string} method - HTTP method to use for the healthcheck.
 * @property {string} host - The host header to send.
 * @property {string} path - The path to check.
 * @property {number} check_interval - How often to run the healthcheck in milliseconds.
 * @property {number} timeout - Request timeout in milliseconds.
 * @property {number} window - The number of most recent healthcheck queries to keep.
 * @property {number} threshold - How many healthchecks must succeed to be considered healthy.
 * @property {string} comment - A freeform descriptive note.
 * @property {string} service_id - Alphanumeric string identifying the service.
 * @property {number} version - Integer identifying a service version.
 * @property {string} created_at - Date and time in ISO 8601 format.
 * @property {string} updated_at - Date and time in ISO 8601 format.
 * @property {string} deleted_at - Date and time in ISO 8601 format.
 */

/**
 * @typedef {object} HealthcheckResponse
 * @property {Healthcheck} data - The healthcheck object.
 */

/**
 * @typedef {object} HealthcheckListResponse
 * @property {Healthcheck[]} data - Array of healthcheck objects.
 */

/**
 * @typedef {object} DeleteResponse
 * @property {string} status - The status of the delete operation.
 */
export default class HealthcheckAPI {
  constructor(base) {
    Object.assign(this, {
      service_id: base.service_id,
      request: base.request,
      getVersion: base.getVersion,
    });
  }

  /**
   * List all healthchecks for a particular service and version.
   *
   * @see https://docs.fastly.com/api/config#healthcheck_126cb37382d68583269420ba772ded36
   * @param {string} version - The current version of a service.
   * @returns {Promise<HealthcheckListResponse>} List of all healthchecks for the specified service
   *   version.
   */
  async readHealthchecks(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/healthcheck`);
  }

  /**
   * Get details of a single named healthcheck.
   *
   * @see https://docs.fastly.com/api/config#healthcheck_b54ea357a2377e62ae7649e609b94966
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the healthcheck.
   * @returns {Promise<HealthcheckResponse>} Details of the specified healthcheck.
   */
  async readHealthcheck(version, name) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/healthcheck/${name}`);
  }

  /**
   * Create a healthcheck for a particular service and version.
   *
   * @see https://docs.fastly.com/api/config#healthcheck_8712be8923dd419c54393da3ac31f6d3
   * @param {string} version - The current version of a service.
   * @param {object} data - The healthcheck definition.
   * @returns {Promise<HealthcheckResponse>} The newly created healthcheck object.
   */
  async createHealthcheck(version, data) {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/healthcheck`, data);
  }

  /**
   * Update the healthcheck for a particular service and version.
   *
   * @see https://docs.fastly.com/api/config#healthcheck_9a60b6005125c4afeaa80111e69d7586
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the healthcheck to update.
   * @param {object} data - The healthcheck definition.
   * @returns {Promise<HealthcheckResponse>} The updated healthcheck object.
   */
  async updateHealthcheck(version, name, data) {
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/healthcheck/${name}`, data);
  }

  /**
   * Delete the healthcheck for a particular service and version.
   *
   * @see https://docs.fastly.com/api/config#healthcheck_a22900c40a2fd59db5028061dc5dfa36
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the healthcheck to delete.
   * @returns {Promise<DeleteResponse>} Confirmation of healthcheck deletion.
   */
  async deleteHealthcheck(version, name) {
    return this.request.delete(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/healthcheck/${name}`);
  }
}
