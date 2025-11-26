/* eslint-disable max-classes-per-file */
import { axiosCreate } from './httpclient.js';
import config from './config.js';
import Conditions from './conditions.js';
import Headers from './headers.js';
import AccountAPI from './api-account.js';
import AuthAPI from './api-auth.js';
import PurgeAPI from './api-purge.js';
import DomainAPI from './api-domain.js';
import PackageAPI from './api-package.js';
import HealthcheckAPI from './api-healthcheck.js';
import SecretStoreAPI from './api-secretstore.js';
import ConfigStoreAPI from './api-configstore.js';
import ResourceAPI from './api-resource.js';

export * as loghelpers from './log-helpers.js';

/**
 * @typedef {object} Service
 * @property {string} id - The service ID
 * @property {string} name - The service name
 * @property {string} comment - Service description
 * @property {string} customer_id - Customer ID
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {boolean} paused - Whether the service is paused
 * @property {Array<Version>} versions - Array of service versions
 */

/**
 * @typedef {object} Version
 * @property {number} number - Version number
 * @property {string} service_id - Service ID
 * @property {boolean} active - Whether this version is active
 * @property {boolean} locked - Whether this version is locked
 * @property {boolean} deployed - Whether this version is deployed
 * @property {boolean} staging - Whether this version is staging
 * @property {boolean} testing - Whether this version is testing
 * @property {string} comment - Version comment
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {object} Dictionary
 * @property {string} id - Dictionary ID
 * @property {string} name - Dictionary name
 * @property {string} service_id - Service ID
 * @property {number} version - Version number
 * @property {boolean} write_only - Whether dictionary is write-only
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string} deleted_at - Deletion timestamp
 */

/**
 * @typedef {object} DictionaryItem
 * @property {string} dictionary_id - Dictionary ID
 * @property {string} service_id - Service ID
 * @property {string} item_key - Item key
 * @property {string} item_value - Item value
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string} deleted_at - Deletion timestamp
 */

/**
 * @typedef {object} Condition
 * @property {string} name - Condition name
 * @property {string} service_id - Service ID
 * @property {number} version - Version number
 * @property {string} statement - VCL condition statement
 * @property {string} type - Condition type (REQUEST, RESPONSE, CACHE)
 * @property {number} priority - Priority (0-100)
 * @property {string} comment - Condition comment
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string} deleted_at - Deletion timestamp
 */

/**
 * @typedef {object} Header
 * @property {string} name - Header name
 * @property {string} service_id - Service ID
 * @property {number} version - Version number
 * @property {string} action - Header action (set, append, delete, regex, regex_repeat)
 * @property {string} type - Header type (request, fetch, cache, response)
 * @property {string} dst - Destination header name
 * @property {string} src - Source value or header name
 * @property {string} regex - Regular expression for regex actions
 * @property {string} substitution - Substitution string for regex actions
 * @property {number} priority - Priority (0-100)
 * @property {string} request_condition - Request condition name
 * @property {string} cache_condition - Cache condition name
 * @property {string} response_condition - Response condition name
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string} deleted_at - Deletion timestamp
 */

/**
 * @typedef {object} Backend
 * @property {string} name - Backend name
 * @property {string} service_id - Service ID
 * @property {number} version - Version number
 * @property {string} address - Backend address
 * @property {number} port - Backend port
 * @property {string} comment - Backend comment
 * @property {boolean} use_ssl - Whether to use SSL
 * @property {string} ssl_hostname - SSL hostname
 * @property {string} ssl_cert_hostname - SSL certificate hostname
 * @property {string} ssl_sni_hostname - SSL SNI hostname
 * @property {number} min_tls_version - Minimum TLS version
 * @property {number} max_tls_version - Maximum TLS version
 * @property {string} ssl_ciphers - SSL ciphers
 * @property {string} ssl_ca_cert - SSL CA certificate
 * @property {string} ssl_client_cert - SSL client certificate
 * @property {string} ssl_client_key - SSL client key
 * @property {number} max_conn - Maximum connections
 * @property {number} first_byte_timeout - First byte timeout
 * @property {number} connect_timeout - Connect timeout
 * @property {number} between_bytes_timeout - Between bytes timeout
 * @property {boolean} auto_loadbalance - Auto load balance
 * @property {number} weight - Backend weight
 * @property {string} request_condition - Request condition name
 * @property {string} healthcheck - Healthcheck name
 * @property {string} shield - Shield POP
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string} deleted_at - Deletion timestamp
 */

/**
 * @typedef {object} ServiceResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Service} data - Service data
 */

/**
 * @typedef {object} ServiceListResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Array<Service>} data - Array of services
 */

/**
 * @typedef {object} VersionResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Version} data - Version data
 */

/**
 * @typedef {object} VersionListResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Array<Version>} data - Array of versions
 */

/**
 * @typedef {object} DictionaryResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Dictionary} data - Dictionary data
 */

/**
 * @typedef {object} DictionaryListResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Array<Dictionary>} data - Array of dictionaries
 */

/**
 * @typedef {object} DictionaryItemResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {DictionaryItem} data - Dictionary item data
 */

/**
 * @typedef {object} DictionaryItemListResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Array<DictionaryItem>} data - Array of dictionary items
 */

/**
 * @typedef {object} ConditionResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Condition} data - Condition data
 */

/**
 * @typedef {object} ConditionListResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Array<Condition>} data - Array of conditions
 */

/**
 * @typedef {object} HeaderResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Header} data - Header data
 */

/**
 * @typedef {object} HeaderListResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Array<Header>} data - Array of headers
 */

/**
 * @typedef {object} BackendResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Backend} data - Backend data
 */

/**
 * @typedef {object} BackendListResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Array<Backend>} data - Array of backends
 */

/**
 * @typedef {object} BulkOperationResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {object} data - Bulk operation result data
 * @property {string} data.status - Operation status
 */

/**
 * @typedef {object} DeleteResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {object} data - Delete operation result
 * @property {string} data.status - Delete status
 */

/**
 * @typedef {object} Snippet
 * @property {string} name - Snippet name
 * @property {string} service_id - Service ID
 * @property {number} version - Version number
 * @property {string} content - VCL snippet content
 * @property {string} type - Snippet type (init, recv, hash, hit, miss, pass, fetch, error,
 *   deliver, log)
 * @property {number} priority - Priority (0-100)
 * @property {boolean} dynamic - Whether snippet is dynamic
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string} deleted_at - Deletion timestamp
 */

/**
 * @typedef {object} ResponseObject
 * @property {string} name - Response object name
 * @property {string} service_id - Service ID
 * @property {number} version - Version number
 * @property {string} content - Response content
 * @property {string} content_type - Content type
 * @property {number} status - HTTP status code
 * @property {string} response - Response name
 * @property {string} request_condition - Request condition name
 * @property {string} cache_condition - Cache condition name
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string} deleted_at - Deletion timestamp
 */

/**
 * @typedef {object} VCL
 * @property {string} name - VCL name
 * @property {string} service_id - Service ID
 * @property {number} version - Version number
 * @property {string} content - VCL content
 * @property {boolean} main - Whether this is the main VCL
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string} deleted_at - Deletion timestamp
 */

/**
 * @typedef {object} VCLResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {VCL} data - VCL data
 */

/**
 * @typedef {object} SnippetResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Snippet} data - Snippet data
 */

/**
 * @typedef {object} SnippetListResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Array<Snippet>} data - Array of snippets
 */

/**
 * @typedef {object} ResponseObjectResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {ResponseObject} data - Response object data
 */

/**
 * @typedef {object} ResponseObjectListResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {Array<ResponseObject>} data - Array of response objects
 */

/**
 * @typedef {object} ApiResponse
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {object} headers - Response headers
 * @property {object} config - Request configuration
 * @property {object} request - HTTP request object
 * @property {any} data - Response data
 */

export class RateLimitError extends Error {

}

export class Fastly {
  /**
   * @typedef {Function} CreateFunction
   * A function that creates a resource of a specific type. If a resource of that
   * name already exists, it will reject the returned promise with an error.
   * @param {string} version - The service config version to operate on. Needs to be checked out.
   * @param {object} data - The data object describing the resource to be created.
   * @param {string} data.name - The name of the resource to be created.
   * @returns {Promise} The response object representing the completion or failure.
   * @throws {FastlyError}
   */

  /**
   * @typedef {Function} UpdateFunction
   * A function that updates an already existing resource of a specific type.
   * If no resource of that name exists, it will reject the returned promise with an error.
   * @param {string} version - The service config version to operate on. Needs to be checked out.
   * @param {string} name - The name of the resource to be updated. The old name in case of renaming
   * something.
   * @param {object} data - The data object describing the resource to be updated.
   * @param {string} data.name - The new name of the resource to be updated.
   * @returns {Promise} The response object representing the completion or failure.
   * @throws {FastlyError}
   */

  /**
   * @typedef {Function} ReadFunction
   * A function that retrieves a representation of a resource of a specific type.
   * If no resource of that name exists, it will reject the returned promise with an error.
   * @param {string} version - The service config version to operate on. Needs to be checked out.
   * @param {string} name - The name of the resource to be retrieved.
   * @returns {Promise} The response object representing the completion or failure.
   * @throws {FastlyError}
   */

  /**
   * @typedef {Function} ListFunction
   * A function that retrieves a list of resources of a specific type.
   * @param {string} version - The service config version to operate on. Needs to be checked out.
   * @returns {Promise} The response object representing the completion or failure.
   * @throws {FastlyError}
   */

  /**
   * Create a new function that lists all log configurations for a given service
   * and version. The function can be parametrized with the name of the logging
   * service.
   *
   * @param {string} service - The id of the logging service. Supported services are:
   * s3, s3canary, azureblob, cloudfiles, digitalocean, ftp, bigquery, gcs, honeycomb,
   * logshuttle, logentries, loggly, heroku, https, openstack, papertrail, scalyr, splunk,
   * sumologic, syslog.
   * @returns {ListFunction} A logging function.
   */
  readLogsFn(service) {
    return async (version) => this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/logging/${service}`);
  }

  /**
   * Create a new function that returns a named log configuration for a given service
   * and version. The function can be parametrized with the name of the logging
   * service.
   *
   * @param {string} service - The id of the logging service. Supported services are:
   * s3, s3canary, azureblob, cloudfiles, digitalocean, ftp, bigquery, gcs, honeycomb,
   * logshuttle, logentries, loggly, heroku, https, openstack, papertrail, scalyr, splunk,
   * sumologic, syslog.
   * @returns {ReadFunction} A logging function.
   */
  readLogFn(service) {
    return async (version, name) => this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/logging/${service}/${name}`);
  }

  /**
   * Create a new function that creates a named log configuration for a given service
   * and version. The function can be parametrized with the name of the logging
   * service.
   *
   * @param {string} service - The id of the logging service. Supported services are:
   * s3, s3canary, azureblob, cloudfiles, digitalocean, ftp, bigquery, gcs, honeycomb,
   * logshuttle, logentries, loggly, heroku, https, openstack, papertrail, scalyr, splunk,
   * sumologic, syslog.
   * @returns {CreateFunction} A logging function.
   */
  createLogFn(service) {
    return async (version, data) => this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/logging/${service}`, data);
  }

  /**
   * Create a new function that updates a named log configuration for a given service
   * and version. The function can be parametrized with the name of the logging
   * service.
   *
   * @param {string} service - The id of the logging service. Supported services are:
   * s3, s3canary, azureblob, cloudfiles, digitalocean, ftp, bigquery, gcs, honeycomb,
   * logshuttle, logentries, loggly, heroku, https, openstack, papertrail, scalyr, splunk,
   * sumologic, syslog.
   * @returns {UpdateFunction} A logging function.
   */
  updateLogFn(service) {
    return async (version, name, data) => this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/logging/${service}/${name}`, data);
  }

  /**
   * Creates an update-or-create or "safe create" function that will either create
   * (if it does not exist) or update (if it does) a named resource. The function
   * will attempt to check if the resource exists first (if a reader function has been
   * provided), alternatively, it will just blindly create and fall back with an
   * update.
   *
   * @param {CreateFunction} createFn - A function that creates a resource.
   * @param {UpdateFunction} updateFn - A function that updates a resource.
   * @param {ReadFunction} readFn - An optional function that checks for the existence
   * of a resource.
   * @returns {UpdateFunction} An update function that does not fail on conflict.
   */
  upsertFn(createFn, updateFn, readFn) {
    if (readFn) {
      // careful
      return (version, name, data) => readFn.apply(this, [version, name])
        .then(() => updateFn.apply(this, [version, name, data]))
        .catch(() => createFn.apply(this, [version, data]))
        .catch(() => updateFn.apply(this, [version, name, data]));
    }
    // stubborn
    return (version, name, data) => createFn.apply(this, [version, data])
      .catch(() => updateFn.apply(this, [version, name, data]));
  }

  /* eslint-disable camelcase */
  /**
   * The constructor method for creating a fastly-promises instance.
   *
   * @param {string} token - The Fastly API token.
   * @param {string} service_id - The Fastly service ID.
   * @param {number} timeout - HTTP timeout for requests to the Fastly API, default: 15 seconds.
   */
  constructor(token, service_id, timeout = 15000) {
    this.service_id = service_id;
    this.request = axiosCreate({
      baseURL: config.mainEntryPoint,
      timeout,
      headers: { 'Fastly-Key': token },
    });

    this.requestmonitor = this.request.monitor;

    this.versions = {
      current: undefined,
      active: undefined,
      latest: undefined,
    };

    this.readS3Logs = this.readLogsFn('s3');
    this.readS3canaryLogs = this.readLogsFn('s3canary');
    this.readAzureblobLogs = this.readLogsFn('azureblob');
    this.readCloudfilesLogs = this.readLogsFn('cloudfiles');
    this.readDigitaloceanLogs = this.readLogsFn('digitalocean');
    this.readFtpLogs = this.readLogsFn('ftp');
    this.readBigqueryLogs = this.readLogsFn('bigquery');
    this.readGcsLogs = this.readLogsFn('gcs');
    this.readHoneycombLogs = this.readLogsFn('honeycomb');
    this.readLogshuttleLogs = this.readLogsFn('logshuttle');
    this.readLogentriesLogs = this.readLogsFn('logentries');
    this.readLogglyLogs = this.readLogsFn('loggly');
    this.readHerokuLogs = this.readLogsFn('heroku');
    this.readOpenstackLogs = this.readLogsFn('openstack');
    this.readPapertrailLogs = this.readLogsFn('papertrail');
    this.readScalyrLogs = this.readLogsFn('scalyr');
    this.readSplunkLogs = this.readLogsFn('splunk');
    this.readSumologicLogs = this.readLogsFn('sumologic');
    this.readSyslogLogs = this.readLogsFn('syslog');
    this.readHttpsLogs = this.readLogsFn('https');

    this.readS3 = this.readLogFn('s3');
    this.readS3canary = this.readLogFn('s3canary');
    this.readAzureblob = this.readLogFn('azureblob');
    this.readCloudfiles = this.readLogFn('cloudfiles');
    this.readDigitalocean = this.readLogFn('digitalocean');
    this.readFtp = this.readLogFn('ftp');
    this.readBigquery = this.readLogFn('bigquery');
    this.readGcs = this.readLogFn('gcs');
    this.readHoneycomb = this.readLogFn('honeycomb');
    this.readLogshuttle = this.readLogFn('logshuttle');
    this.readLogentries = this.readLogFn('logentries');
    this.readLoggly = this.readLogFn('loggly');
    this.readHeroku = this.readLogFn('heroku');
    this.readOpenstack = this.readLogFn('openstack');
    this.readPapertrail = this.readLogFn('papertrail');
    this.readScalyr = this.readLogFn('scalyr');
    this.readSplunk = this.readLogFn('splunk');
    this.readSumologic = this.readLogFn('sumologic');
    this.readSyslog = this.readLogFn('syslog');
    this.readHttps = this.readLogFn('https');

    this.createS3 = this.createLogFn('s3');
    this.createS3canary = this.createLogFn('s3canary');
    this.createAzureblob = this.createLogFn('azureblob');
    this.createCloudfiles = this.createLogFn('cloudfiles');
    this.createDigitalocean = this.createLogFn('digitalocean');
    this.createFtp = this.createLogFn('ftp');
    this.createBigquery = this.createLogFn('bigquery');
    this.createGcs = this.createLogFn('gcs');
    this.createHoneycomb = this.createLogFn('honeycomb');
    this.createLogshuttle = this.createLogFn('logshuttle');
    this.createLogentries = this.createLogFn('logentries');
    this.createLoggly = this.createLogFn('loggly');
    this.createHeroku = this.createLogFn('heroku');
    this.createOpenstack = this.createLogFn('openstack');
    this.createPapertrail = this.createLogFn('papertrail');
    this.createScalyr = this.createLogFn('scalyr');
    this.createSplunk = this.createLogFn('splunk');
    this.createSumologic = this.createLogFn('sumologic');
    this.createSyslog = this.createLogFn('syslog');
    this.createHttps = this.createLogFn('https');

    this.updateS3 = this.updateLogFn('s3');
    this.updateS3canary = this.updateLogFn('s3canary');
    this.updateAzureblob = this.updateLogFn('azureblob');
    this.updateCloudfiles = this.updateLogFn('cloudfiles');
    this.updateDigitalocean = this.updateLogFn('digitalocean');
    this.updateFtp = this.updateLogFn('ftp');
    this.updateBigquery = this.updateLogFn('bigquery');
    this.updateGcs = this.updateLogFn('gcs');
    this.updateHoneycomb = this.updateLogFn('honeycomb');
    this.updateLogshuttle = this.updateLogFn('logshuttle');
    this.updateLogentries = this.updateLogFn('logentries');
    this.updateLoggly = this.updateLogFn('loggly');
    this.updateHeroku = this.updateLogFn('heroku');
    this.updateOpenstack = this.updateLogFn('openstack');
    this.updatePapertrail = this.updateLogFn('papertrail');
    this.updateScalyr = this.updateLogFn('scalyr');
    this.updateSplunk = this.updateLogFn('splunk');
    this.updateSumologic = this.updateLogFn('sumologic');
    this.updateSyslog = this.updateLogFn('syslog');
    this.updateHttps = this.updateLogFn('https');

    this.writeS3 = this
      .upsertFn(this.createS3, this.updateS3, this.readS3);
    this.writeS3canary = this
      .upsertFn(this.createS3canary, this.updateS3canary, this.readS3canary);
    this.writeAzureblob = this
      .upsertFn(this.createAzureblob, this.updateAzureblob, this.readAzureblob);
    this.writeCloudfiles = this
      .upsertFn(this.createCloudfiles, this.updateCloudfiles, this.readCloudfiles);
    this.writeDigitalocean = this
      .upsertFn(this.createDigitalocean, this.updateDigitalocean, this.readDigitalocean);
    this.writeFtp = this
      .upsertFn(this.createFtp, this.updateFtp, this.readFtp);
    this.writeBigquery = this
      .upsertFn(this.createBigquery, this.updateBigquery, this.readBigquery);
    this.writeGcs = this
      .upsertFn(this.createGcs, this.updateGcs, this.readGcs);
    this.writeHoneycomb = this
      .upsertFn(this.createHoneycomb, this.updateHoneycomb, this.readHoneycomb);
    this.writeLogshuttle = this
      .upsertFn(this.createLogshuttle, this.updateLogshuttle, this.readLogshuttle);
    this.writeLogentries = this
      .upsertFn(this.createLogentries, this.updateLogentries, this.readLogentries);
    this.writeLoggly = this
      .upsertFn(this.createLoggly, this.updateLoggly, this.readLoggly);
    this.writeHeroku = this
      .upsertFn(this.createHeroku, this.updateHeroku, this.readHeroku);
    this.writeOpenstack = this
      .upsertFn(this.createOpenstack, this.updateOpenstack, this.readOpenstack);
    this.writePapertrail = this
      .upsertFn(this.createPapertrail, this.updatePapertrail, this.readPapertrail);
    this.writeScalyr = this
      .upsertFn(this.createScalyr, this.updateScalyr, this.readScalyr);
    this.writeSplunk = this
      .upsertFn(this.createSplunk, this.updateSplunk, this.readSplunk);
    this.writeSumologic = this
      .upsertFn(this.createSumologic, this.updateSumologic, this.readSumologic);
    this.writeSyslog = this
      .upsertFn(this.createSyslog, this.updateSyslog, this.readSyslog);
    this.writeHttps = this
      .upsertFn(this.createHttps, this.updateHttps, this.readHttps);

    this.writeVCL = this.upsertFn(this.createVCL, this.updateVCL);
    this.writeSnippet = this.upsertFn(this.createSnippet, this.updateSnippet, this.readSnippet);
    this.writeBackend = this.upsertFn(this.createBackend, this.updateBackend);

    this.writeCondition = this.upsertFn(
      this.createCondition,
      this.updateCondition,
      this.readCondition,
    );

    this.writeHeader = this.upsertFn(
      this.createHeader,
      this.updateHeader,
      this.readHeader,
    );

    this.writeResponse = this.upsertFn(
      this.createResponse,
      this.updateResponse,
      this.readResponse,
    );

    this.conditions = new Conditions(this);
    this.headers = new Headers(this);

    // bind the methods of the API classes.
    [
      AccountAPI,
      AuthAPI,
      PurgeAPI,
      DomainAPI,
      HealthcheckAPI,
      PackageAPI,
      SecretStoreAPI,
      ConfigStoreAPI,
      ResourceAPI,
    ].forEach((API) => {
      const api = new API(this);
      Object.getOwnPropertyNames(API.prototype).forEach((name) => {
        const prop = api[name];
        if (typeof prop === 'function' && !name.startsWith('_') && name !== 'constructor') {
          this[name] = prop.bind(api);
        }
      });
    });

    this.writeHealthcheck = this.upsertFn(
      this.createHealthcheck,
      this.updateHealthcheck,
      this.readHealtcheck,
    );
  }

  /**
   * Free resources bound to the HTTP client (pending sessions/sockets)
   * and allow the node process to quit.
   *
   * @returns {Promise} A promise which resolves when all resources have been freed.
   */
  // eslint-disable-next-line class-methods-use-this
  discard() {
    return this.request.discard();
  }

  /**
   * @typedef {object} FastlyError
   * The FastlyError class describes the most common errors that can occur
   * when working with the Fastly API. Using `error.status`, the underlying
   * HTTP status code can be retrieved. Known error status codes include:
   * - 400: attempting to activate invalid VCL
   * - 401: invalid credentials
   * - 404: resource not found
   * - 409: confict when trying to POST a resource that already exists
   * - 422: attempting to modify a service config that is not checked out
   * - 429: rate limit exceeded, try again later
   * @property {number} status The HTTP status code from the server response, e.g. 200.
   * @property {object} data The parsed body of the HTTP response.
   * @property {string} code A short error message.
   * @property {string} message A more detailed error message.
   */

  /**
   * @typedef {object} Response
   * @property {number} status The HTTP status code from the server response, e.g. 200.
   * @property {string} statusText The HTTP status text, e.g. 'OK'.
   * @property {object} headers The HTTP headers of the reponse.
   * @property {object} config The original request configuration used for the HTTP client.
   * @property {object} request The HTTP request.
   * @property {object} data The parsed body of the HTTP response.
   */

  /**
   * Get a list of all Fastly datacenters and their locations.
   *
   * @see https://docs.fastly.com/api/tools#datacenter_1c8d3b9dd035e301155b44eae05e0554
   * @example
   * instance.dataCenters()
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @returns {Promise<ApiResponse>} List of all Fastly datacenters with location details.
   */
  dataCenters() {
    return this.request.get('/datacenters');
  }

  /**
   * Get Fastly's current service IP address ranges.
   *
   * @see https://docs.fastly.com/api/tools#public_ip_list_ef2e9900a1c9522b58f5abed92ec785e
   * @example
   * instance.publicIpList()
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @returns {Promise<ApiResponse>} Current IP ranges used by Fastly services.
   */
  publicIpList() {
    return this.request.get('/public-ip-list');
  }

  /**
   * Check content headers and MD5 hash from all Fastly edge servers for the specified URL.
   *
   * @see https://docs.fastly.com/api/tools#content_4d2d4548b29c7661e17ebe7098872d6d
   * @example
   * instance.edgeCheck('api.example.com')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} url - Full URL (host and path) to check on all nodes. If protocol is omitted,
   http will be assumed.
   * @returns {Promise<ApiResponse>} Content headers and MD5 hash from each edge server.
   */
  edgeCheck(url = '') {
    return this.request.get(`/content/edge_check?url=${url}`);
  }

  /**
   * List all services for the account.
   *
   * @see https://docs.fastly.com/api/config#service_74d98f7e5d018256e44d1cf820388ef8
   * @example
   * instance.readServices()
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @returns {Promise<ServiceListResponse>} List of all services for the account.
   */
  readServices() {
    return this.request.get('/service');
  }

  /**
   * List all services for the account as a map indexed by service ID.
   *
   * @returns {Promise<ServiceListResponse>} Services mapped by service ID for easy lookup.
   */
  async readServicesById() {
    const ret = await this.request.get('/service');
    ret.data = ret.data.reduce((dat, service) => Object.assign(dat, { [service.id]: service }), {});
    return ret;
  }

  /**
   * Get details of the specified service.
   *
   * @see https://docs.fastly.com/api/config#service_a884a9abd5af9723f6fcbb1ed13ae4cc
   * @param {string} [serviceId] - The service id.
   * @returns {Promise<ServiceResponse>} Details of the specified service.
   */
  async readService(serviceId = this.service_id) {
    return this.request.get(`/service/${serviceId}`);
  }

  /**
   * List all versions for the service.
   *
   * @see https://docs.fastly.com/api/config#version_dfde9093f4eb0aa2497bbfd1d9415987
   * @example
   * instance.readVersions()
   .then(res => {
     const active = res.data.filter(version => version.active);
     console.log(active);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @returns {Promise<VersionListResponse>} List of all versions for the service.
   */
  readVersions() {
    return this.request.get(`/service/${this.service_id}/version`);
  }

  /**
   * @typedef {object} Versions
   *
   * Describes the most relevant versions of the service.
   *
   * @property {number} latest - The latest version of the service.
   * @property {number} active - The currently active version number.
   * @property {number} current - The latest editable version number.
   */
  /**
   * Gets the version footprint for the service.
   *
   * @returns {Versions} The latest, current, and active versions of the service.
   */
  async getVersions() {
    if (this.versions.latest) {
      return this.versions;
    }
    const { data } = await this.readVersions();
    this.versions.initial = 1;
    this.versions.latest = data
      .map(({ number }) => number)
      .pop();
    this.versions.active = data
      .filter((version) => version.active)
      .map(({ number }) => number)
      .pop();
    this.versions.current = data
      .filter((version) => !version.locked)
      .map(({ number }) => number)
      .pop();

    return this.versions;
  }

  async getVersion(version, ...fallbackname) {
    if (version) {
      return version;
    }
    const versions = await this.getVersions();
    return fallbackname.map((attempt) => versions[attempt]).filter((e) => e)[0];
  }

  /**
   * Clone the specified version into a new editable version.
   *
   * @param {string} version - The version to be cloned.
   * @see https://docs.fastly.com/api/config#version_7f4937d0663a27fbb765820d4c76c709
   * @example
   * instance.cloneVersion('45')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @returns {Promise<VersionResponse>} The newly created version ready for editing.
   */
  async cloneVersion(version) {
    const versions = await this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'active', 'current', 'latest', 'initial')}/clone`);
    this.versions.current = versions.data.number;
    this.versions.latest = versions.data.number;
    return versions;
  }

  /**
   * Activate the specified version to make it live.
   *
   * @param {string} version - The version to be activated.
   * @see https://docs.fastly.com/api/config#version_0b79ae1ba6aee61d64cc4d43fed1e0d5
   * @example
   * instance.activateVersion('23')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @returns {Promise<VersionResponse>} The activated version now serving traffic.
   */
  async activateVersion(version) {
    const versions = await this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/activate`);
    this.versions.active = versions.data.number;
    this.versions.latest = versions.data.number;
    return versions;
  }

  // === start ===

  /**
   * List all items in the specified dictionary.
   *
   * @see https://docs.fastly.com/api/config#dictionary_item_a48de28cd7e76c1ea58523f39bb7204b
   * @example
   * instance.readDictItems(1, 'my_dictionary')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The version of the dictionary.
   * @param {string} name - The name of the dictionary.
   * @returns {Promise<DictionaryItemListResponse>} List of all items in the dictionary.
   */
  async readDictItems(version, name) {
    return this.readDictionary(
      await this.getVersion(version, 'latest'),
      name,
    ).then(({ data }) => this.request.get(`/service/${this.service_id}/dictionary/${data.id}/items`));
  }

  /**
   * Get details of the specified dictionary item.
   *
   * @see https://docs.fastly.com/api/config#dictionary_item_08f090cd03ed4602ae63f131087e2f29
   * @example
   * instance.readDictItem('12', 'extensions', 'some_key')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - Name of the dictionary.
   * @param {string} key - The key to retrieve values by.
   * @returns {Promise<DictionaryItemResponse>} Details of the specified dictionary item.
   */
  async readDictItem(version, name, key) {
    return this.readDictionary(
      await this.getVersion(version, 'latest'),
      name,
    ).then(({ data }) => {
      if (data.write_only) {
        return {
          status: 403, // not permitted to read from write-only dicts
          data: {
            dictionary_id: data.id,
            service_id: this.service_id,
            item_key: key,
            item_value: undefined,
            created_at: undefined,
            deleted_at: undefined,
            updated_at: undefined,
          },
        };
      }
      // always use uncached version here
      return this.request.get.fresh(`/service/${this.service_id}/dictionary/${data.id}/item/${encodeURIComponent(key)}`);
    });
  }

  /**
   * Create a new item in the specified dictionary.
   *
   * @see https://docs.fastly.com/api/config#dictionary_item_6ec455c0ba1b21671789e1362bc7fe55
   * @param {number} version - The version number (current if omitted).
   * @param {object} name - The dictionary definition.
   * @param {string} key - The key.
   * @param {string} value - The value to write.
   * @returns {Promise<DictionaryItemResponse>} The newly created dictionary item.
   */
  async createDictItem(version, name, key, value) {
    return this.readDictionary(
      await this.getVersion(version, 'latest'),
      name,
    ).then(({ data }) => this.request.post(`/service/${this.service_id}/dictionary/${data.id}/item`, {
      item_key: key,
      item_value: value,
    }));
  }

  /**
   * @typedef {object} DictUpdate
   * Specifies a dictionary update operation. In most cases, `upsert` is the best way
   * to update values, as it will work for existing and non-existing items.
   * @property {string} op - The operation: `create`, `update`, `delete`, or `upsert`.
   * @property {string} item_key - The lookup key.
   * @property {string} item_value - The dictionary value.
   */
  /**
   * Update multiple dictionary items in a single bulk operation.
   *
   * @param {number} version - The version numer (current if ommitted).
   * @param {string} name - Name of the dictionary.
   * @param  {...DictUpdate} items - The dictionary update operations.
   * @returns {Promise<BulkOperationResponse>} Result of the bulk update operation.
   * @example
   * // single item
   * fastly.bulkUpdateDictItems(1, 'secret_dictionary',
   *   { item_key: 'some_key', item_value: 'some_value', op: 'upsert' });
   *
   * // multiple items
   * fastly.bulkUpdateDictItems(1, 'secret_dictionary',
   *   { item_key: 'some_key', item_value: 'some_value', op: 'update' },
   *   { item_key: 'other_key', item_value: 'other_value', op: 'update' });
   */
  async bulkUpdateDictItems(version, name, ...items) {
    return this.readDictionary(
      await this.getVersion(version, 'latest'),
      name,
    ).then(({ data }) => this.request.patch(`/service/${this.service_id}/dictionary/${data.id}/items`, {
      items,
    }));
  }

  /**
   * Update the value of the specified dictionary item.
   *
   * @see https://docs.fastly.com/api/config#dictionary_item_34c884a7cdce84dfcfd38dac7a0b5bb0
   * @example
   * instance.updateDictItem(1, 'extensions', 'html', 'text/html')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the dictionary.
   * @param {string} key - The key to update data under.
   * @param {string} value - The value to update the dictionary with.
   * @returns {Promise<DictionaryItemResponse>} The updated dictionary item.
   */
  async updateDictItem(version, name, key, value) {
    return this.readDictionary(
      await this.getVersion(version, 'latest'),
      name,
    ).then(({ data }) => this.request.put(`/service/${this.service_id}/dictionary/${data.id}/item/${encodeURIComponent(key)}`, {
      item_value: value,
    }));
  }

  /**
   * Delete the specified dictionary item.
   *
   * @see https://docs.fastly.com/api/config#dictionary_item_664347e743b8eafc9a93c729d9da0427
   * @example
   * instance.deleteDictItem('34', 'extensions', 'html')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the dictionary.
   * @param {string} key - The key to update data under.
   * @returns {Promise<DeleteResponse>} Confirmation of dictionary item deletion.
   */
  async deleteDictItem(version, name, key) {
    return this.readDictionary(
      await this.getVersion(version, 'latest'),
      name,
    ).then(({ data }) => this.request.delete(`/service/${this.service_id}/dictionary/${data.id}/item/${encodeURIComponent(key)}`));
  }

  /**
   * Create, update or delete a dictionary item with automatic conflict resolution.
   *
   * @param {number} version - Service version to use for dictionary lookup.
   * @param {string} name - Name of the dictionary (not ID).
   * @param {string} key - Key to create, update or delete.
   * @param {string} value - Value to update. Empty strings will delete the dictionary entry.
   * @returns {Promise<DictionaryItemResponse|DeleteResponse>} The created, updated, or deleted
   *   dictionary item.
   */
  writeDictItem(version, name, key, value) {
    return this.readDictItem(version, name, key)
      .then(() => {
        // the dictionary item already exists
        if (value) {
          // update existing value
          return this.updateDictItem(version, name, key, value);
        }
        // value is undefined. Fastly does not support overwriting with empty
        // values, so we delete the value
        return this.deleteDictItem(version, name, key);
      })
      .catch(() => {
        // the dictionary item does not exist
        if (value) {
          return this.createDictItem(version, name, key, value);
        }
        // the item does not exist and there is no data to write, we just pretend it went ok
        return {
          status: 200,
          data: {
            status: 'ok',
          },
        };
      });
  }

  // === done ===

  /**
   * List all dictionaries for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#dictionary_6d2cc293b994eb8c16d93e92e91f3915
   * @example
   * instance.readDictionaries('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @returns {Promise<DictionaryListResponse>} List of all dictionaries for the service version.
   */
  async readDictionaries(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/dictionary`);
  }

  /**
   * Get details of the specified dictionary.
   *
   * @see https://docs.fastly.com/api/config#dictionary_0e16df083830ed3b6c30b73dcef64014
   * @example
   * instance.readDictionary('12', 'extensions')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - Name of the dictionary.
   * @returns {Promise<DictionaryResponse>} Details of the specified dictionary.
   */
  async readDictionary(version, name) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/dictionary/${name}`);
  }

  /**
   * Create a new dictionary for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#dictionary_7d48b87bf82433162a3b209292722125
   * @param {number} version - The version number (current if omitted).
   * @param {object} data - The dictionary definition.
   * @returns {Promise<DictionaryResponse>} The newly created dictionary object.
   */
  async createDictionary(version, data) {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/dictionary`, data);
  }

  /**
   * Update the specified dictionary with new configuration.
   *
   * @see https://docs.fastly.com/api/config#dictionary_8c9da370b1591d99e5389143a5589a32
   * @example
   * instance.updateDictionary('34', 'old-name', { name: 'new-name' })
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the dictionary.
   * @param {object} data - The data to be sent as the request body.
   * @returns {Promise<DictionaryResponse>} The updated dictionary object.
   */
  async updateDictionary(version, name, data) {
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/dictionary/${encodeURIComponent(name)}`, data);
  }

  async writeDictionary(version, name, data) {
    try {
      const existing = await this.readDictionary(version, name);
      // keep the write-only status
      const mydata = {
        name: data.name,
        write_only: existing.data.write_only,
      };
      if (mydata.name && mydata.name !== existing.data.name) {
        return this.updateDictionary(version, name, mydata);
      }
      return existing;
    } catch (e) {
      return this.createDictionary(version, data);
    }
  }

  /**
   * Delete the specified dictionary from the service version.
   *
   * @see https://docs.fastly.com/api/config#dictionary_8c9da370b1591d99e5389143a5589a32
   * @example
   * instance.deleteDictionary('34', 'extensions')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the dictionary.
   * @returns {Promise<DeleteResponse>} Confirmation of dictionary deletion.
   */
  async deleteDictionary(version, name) {
    return this.request.delete(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/dictionary/${encodeURIComponent(name)}`);
  }

  /* ==CONDITIONS */

  /**
   * List all conditions for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#condition_b61196c572f473c89863a81cc5912861
   * @example
   * instance.readConditions('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @returns {Promise<ConditionListResponse>} List of all conditions for the service version.
   */
  async readConditions(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/condition`);
  }

  /**
   * Get details of the specified condition.
   *
   * @see https://docs.fastly.com/api/config#condition_149a2f48485ceb335f70504e5269b77e
   * @example
   * instance.readCondition('12', 'returning')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - Name of the condition.
   * @returns {Promise<ConditionResponse>} Details of the specified condition.
   */
  async readCondition(version, name) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/condition/${name}`);
  }

  /**
   * Get details of the specified snippet.
   *
   * @see https://developer.fastly.com/reference/api/vcl-services/snippet/
   * @example
   * instance.readSnippet('12', 'returning')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - Name of the snippet.
   * @returns {Promise<SnippetResponse>} Details of the specified snippet.
   */
  async readSnippet(version, name) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/snippet/${name}`);
  }

  /**
   * Create a new condition for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#condition_551199dbec2271195319b675d8659226
   * @param {number} version - The version number (current if omitted).
   * @param {object} data - The condition definition.
   * @returns {Promise<ConditionResponse>} The newly created condition object.
   */
  async createCondition(version, data) {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/condition`, data);
  }

  /**
   * Update the specified condition with new configuration.
   *
   * @see https://docs.fastly.com/api/config#condition_01a2c4e4b44943b541e001013b665deb
   * @example
   * instance.updateCondition('34', 'returning', { name: 'returning-visitor' })
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the condition.
   * @param {object} data - The data to be sent as the request body.
   * @returns {Promise<ConditionResponse>} The updated condition object.
   */
  async updateCondition(version, name, data) {
    const mydata = { ...data };
    // cannot change type of condition
    delete mydata.type;
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/condition/${encodeURIComponent(name)}`, mydata);
  }

  /**
   * Delete the specified condition from the service version.
   *
   * @see https://docs.fastly.com/api/config#condition_2b902b7649c46b4541f00a920d06c94d
   * @example
   * instance.deleteCondition('34', 'extensions')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the condition.
   * @returns {Promise<DeleteResponse>} Confirmation of condition deletion.
   */
  async deleteCondition(version, name) {
    return this.request.delete(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/condition/${encodeURIComponent(name)}`);
  }

  /* == HEADERS */

  /**
   * List all headers for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#header_dd9da0592b2f1ff8ef0a4c1943f8abff
   * @example
   * instance.readHeaders('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @returns {Promise<HeaderListResponse>} List of all headers for the service version.
   */
  async readHeaders(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/header`);
  }

  /**
   * Get details of the specified header.
   *
   * @see https://docs.fastly.com/api/config#header_86469e5eba4e5d6b1463e81f82a847e0
   * @example
   * instance.readHeader('12', 'returning')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - Name of the header.
   * @returns {Promise<HeaderResponse>} Details of the specified header.
   */
  async readHeader(version, name) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/header/${name}`);
  }

  /**
   * Create a new header for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#header_151df4ce647a8e222e730b260287cb39
   * @param {number} version - The version number (current if omitted).
   * @param {object} data - The header definition.
   * @returns {Promise<HeaderResponse>} The newly created header object.
   */
  async createHeader(version, data) {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/header`, data);
  }

  /**
   * Update the specified header with new configuration.
   *
   * @see https://docs.fastly.com/api/config#header_c4257a0fd0eb017ea47b1fbb318fd61c
   * @example
   * instance.updateHeader('34', 'returning', { name: 'returning-visitor' })
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the header.
   * @param {object} data - The data to be sent as the request body.
   * @returns {Promise<HeaderResponse>} The updated header object.
   */
  async updateHeader(version, name, data) {
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/header/${encodeURIComponent(name)}`, data);
  }

  /**
   * Delete the specified header from the service version.
   *
   * @see https://docs.fastly.com/api/config#header_4bbb73fffda4d189bf5a19b474399a83
   * @example
   * instance.deleteHeader('34', 'extensions')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the header.
   * @returns {Promise<DeleteResponse>} Confirmation of header deletion.
   */
  async deleteHeader(version, name) {
    return this.request.delete(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/header/${encodeURIComponent(name)}`);
  }

  /**
   * Delete the specified synthetic response object from the service version.
   *
   * @see https://developer.fastly.com/reference/api/vcl-services/response-object/
   * @example
   * instance.deleteResponse('34', 'extensions')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the response.
   * @returns {Promise<DeleteResponse>} Confirmation of response object deletion.
   */
  async deleteResponse(version, name) {
    return this.request.delete(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/response_object/${encodeURIComponent(name)}`);
  }

  /**
   * List all backends for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#backend_fb0e875c9a7669f071cbf89ca32c7f69
   * @example
   * instance.readBackends('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @returns {Promise<BackendListResponse>} List of all backends for the service version.
   */
  async readBackends(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/backend`);
  }

  /**
   * Update the specified backend with new configuration.
   *
   * @see https://docs.fastly.com/api/config#backend_fb3b3529417c70f57458644f7aec652e
   * @example
   * instance.updateBackend('34', 'slow-server', { name: 'fast-server' })
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the backend.
   * @param {object} data - The data to be sent as the request body.
   * @returns {Promise<BackendResponse>} The updated backend object.
   */
  async updateBackend(version, name, data) {
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/backend/${encodeURIComponent(name)}`, data);
  }

  /**
   * Create a new backend for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#backend_85c170418ee71191dbb3b5046aeb6c2c
   * @param {number} version - The version number (current if omitted).
   * @param {object} data - The backend definition.
   * @returns {Promise<BackendResponse>} The newly created backend object.
   */
  async createBackend(version, data) {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/backend`, data);
  }
  /**
   * @typedef {object} Snippet
   * @property {string} name The name of the snippet, as visible in the Fastly UI.
   * @property {string} content The VCL body of the snippet.
   */

  /**
   * @typedef {object} ResponseObject
   * @property {string} name The name of the synthetic response, as visible in the Fastly UI.
   * @property {string} content The body of the response.
   * @property {string} content_type The content type.
   * @property {number} status Http status code.
   * @property {string} request_condition Name of a request condition.
   */

  /**
   * List all snippets for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#api-section-snippet
   * @example
   * instance.readSnippets('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @returns {Promise<SnippetListResponse>} List of all snippets for the service version.
   */
  async readSnippets(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/snippet`);
  }

  /**
   * Create a new snippet for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#snippet_41e0e11c662d4d56adada215e707f30d
   * @example
   * instance.createSnippet('36', {
    name: 'your_snippet',
    priority: 10,
    dynamic: 1,
    content: 'table referer_blacklist {}',
    type: 'init'
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
   * @param {string} version - The current version of a service.
   * @param {Snippet} data - The data to be sent as the request body.
   * @returns {Promise<SnippetResponse>} The newly created snippet object.
   */
  async createSnippet(version, data) {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/snippet`, data);
  }

  /**
   * Update the specified snippet with new configuration.
   *
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the snippet to update.
   * @param {Snippet} data - The data to be sent as the request body.
   * @returns {Promise<SnippetResponse>} The updated snippet object.
   */
  async updateSnippet(version, name, data) {
    const mydata = { ...data };
    delete mydata.type;
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/snippet/${name}`, mydata);
  }

  /**
   * List all synthetic response objects for the specified service version.
   *
   * @see https://developer.fastly.com/reference/api/vcl-services/response-object/
   * @example
   * instance.readResponses('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @returns {Promise<ResponseObjectListResponse>} List of all response objects for the
   *   service version.
   */
  async readResponses(version) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/response_object`);
  }

  /**
   * Get details of the specified synthetic response object.
   *
   * @see https://developer.fastly.com/reference/api/vcl-services/response-object/
   * @example
   * instance.readResponse('12', 'returning')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
   * @param {string} version - The current version of a service.
   * @param {string} name - Name of the response object.
   * @returns {Promise<ResponseObjectResponse>} Details of the specified response object.
   */
  async readResponse(version, name) {
    return this.request.get(`/service/${this.service_id}/version/${await this.getVersion(version, 'latest')}/response_object/${name}`);
  }

  /**
   * Create a new synthetic response object for the specified service version.
   *
   * @see https://developer.fastly.com/reference/api/vcl-services/response-object/
   * @example
   * instance.createResponse('36', {
    status: 200,
    name: 'test-response',
    content: 'This message means all is okay.'
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
   * @param {string} version - The current version of a service.
   * @param {ResponseObject} data - The data to be sent as the request body.
   * @returns {Promise<ResponseObjectResponse>} The newly created response object.
   */
  async createResponse(version, data) {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/response_object`, data);
  }

  /**
   * Update the specified synthetic response object with new configuration.
   *
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the response object to update.
   * @param {ResponseObject} data - The data to be sent as the request body.
   * @returns {Promise<ResponseObjectResponse>} The updated response object.
   */
  async updateResponse(version, name, data) {
    const mydata = { ...data };
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/response_object/${name}`, mydata);
  }

  /**
   * Create custom VCL for the specified service version.
   *
   * @see https://docs.fastly.com/api/config#vcl_7ade6ab5926b903b6acf3335a85060cc
   * @param {string} version - The current version of a service.
   * @param {VCL} data - The data to be sent as the request body.
   * @returns {Promise<VCLResponse>} The newly created VCL object.
   */
  async createVCL(version, data) {
    return this.request.post(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/vcl`, data);
  }

  /**
   * Update the specified custom VCL with new configuration.
   *
   * @see https://docs.fastly.com/api/config#vcl_0971365908e17086751c5ef2a8053087
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the VCL to update.
   * @param {VCL} data - The data to be sent as the request body.
   * @returns {Promise<VCLResponse>} The updated VCL object.
   */
  async updateVCL(version, name, data) {
    if (typeof name === 'object') {
      /* eslint-disable no-param-reassign */
      data = name;
      name = data.name;
      /* eslint-enable no-param-reassign */
    }
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/vcl/${name}`, data);
  }

  /**
   * Set the specified VCL as the main VCL for the service version.
   *
   * @see https://docs.fastly.com/api/config#vcl_5576c38e7652f5a7261bfcad41c0faf1
   * @param {string} version - The current version of a service.
   * @param {string} name - The name of the VCL to declare main.
   * @returns {Promise<VCLResponse>} The VCL object now set as main.
   */
  async setMainVCL(version, name) {
    return this.request.put(`/service/${this.service_id}/version/${await this.getVersion(version, 'current')}/vcl/${name}/main`, {});
  }

  /**
   * Creates a new version, runs the function `operations` and then
   * optionally activates the newly created version. This function
   * is useful for making modifications to a service config.
   *
   * You can provide a `limit` of write operations, which is an estimate
   * of the number of write operations that will be attempted. If the
   * limit is higher than the number of actions allowed by Fastly's rate
   * limits, the function will fail fast after cloning the service config.
   *
   * @example
   * ```javascript
   * await fastly.transact(async (newversion) => {
   *  await fastly.doSomething(newversion);
   * });
   * // new version has been activated
   * ```
   * @param {Function} operations - A function that performs changes on the service config.
   * @param {boolean} activate - Set to false to prevent automatic activation.
   * @param {number} limit - Number of write operations that will be performed in this action.
   * @returns {object} The return value of the wrapped function.
   */
  async transact(operations, activate = true, limit = 0) {
    const newversion = (await this.cloneVersion()).data.number;
    if (limit > 0 && this.requestmonitor.remaining && this.requestmonitor.remaining < limit) {
      throw new RateLimitError(`Insufficient number of requests (${this.requestmonitor.remaining}) remaining for number of scheduled operations (${limit})`);
    }
    const result = await operations.apply(this, [newversion]);
    if (activate) {
      await this.activateVersion(newversion);
    }
    return result;
  }

  /**
   * See `transact`, but this version does not activate the created version.
   *
   * @see #transact
   * @param {Function} operations - The operations that should be applied to the
   * cloned service config version.
   * @returns {object} Whatever `operations` returns.
   */
  async dryrun(operations) {
    return this.transact(operations, false);
  }
}

/**
 * Function to create a new fastly-promises instance.
 *
 * @param {string} token - The Fastly API token.
 * @param {string} service_id - The Fastly service ID.
 * @param {number} timeout - Timeout in seconds.
 * @returns {Fastly} The exported module.
 */
export default (token, service_id, timeout) => new Fastly(token, service_id, timeout);
