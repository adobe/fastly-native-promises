const hash = require('object-hash');
const fetchAPI = require('@adobe/helix-fetch');
const FormData = require('form-data');

const { AbortError, Headers } = fetchAPI;
const { Lock } = require('./lock');

class FastlyError extends Error {
  constructor(response, text) {
    try {
      const body = JSON.parse(text);
      super(body.detail || body.msg || text);
      this.data = body;
      this.code = body.msg;
    } catch {
      // eslint-disable-next-line constructor-super
      super(text);
    }

    this.status = response.status;
    this.name = 'FastlyError';
  }
}

function memo(fn) {
  const keyfn = (...args) => hash(args[0]);
  const cache = new Map();
  return (...fnargs) => {
    const key = keyfn(...fnargs);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const prom = fn(...fnargs);
    return Promise.resolve(prom).then((res) => {
      cache.set(key, res);
      return res;
    }).catch((e) => {
      throw e;
    });
  };
}

function repeatError(error) {
  if (error.name === 'FastlyError') {
    return false;
  }
  return error.name === 'Error' || error instanceof AbortError || error.name === 'FetchError';
}

function repeatResponse({ status }) {
  if (status === 429) {
    return true;
  }
  if (status > 500 && status < 505) {
    return true;
  }
  return false;
}

/**
 * Determines if a response or error indicates that the response is repeatable.
 *
 * @param {object} responseOrError - – the error response or error object.
 * @returns {boolean} - True, if another attempt can be made.
 */
function repeat(responseOrError) {
  if (responseOrError instanceof Error) {
    return repeatError(responseOrError);
  }
  return responseOrError.status ? repeatResponse(responseOrError) : false;
}

function create({ baseURL, timeout, headers }) {
  const context = process.env.HELIX_FETCH_FORCE_HTTP1
    ? fetchAPI.context({
      alpnProtocols: [fetchAPI.ALPN_HTTP1_1],
    })
    : fetchAPI.context();
  const { fetch } = context;

  const responselog = [];
  /**
   * Creates a function that mimicks the Axios request API
   * for the selected HTTP method. Optionally enables
   * memoization (function will always return the same results
   * for the same arguments).
   *
   * @param {string} method - The HTTP method (lowercase).
   * @param {boolean} memoize - Cache results (off by default).
   * @param {number} retries - Number of retries in case of flaky servers (default 0).
   * @returns {Function} - A function that makes HTTP requests.
   */
  function makereq(method, memoize = false, retries = 0) {
    const myreq = function req(path, body, config) {
      const myHeaders = new Headers(Object.assign(
        headers,
        config && config.headers ? config.headers : {},
      ));

      const options = {
        method,
        headers: myHeaders,
        cache: 'no-store',
      };

      const uri = `${baseURL}${path}`;

      if (timeout) {
        options.signal = context.timeoutSignal(timeout);
      }

      // set body or form based on content type. default is form, except for patch ;-)
      const contentType = myHeaders.get('content-type')
        || (method === 'patch' ? 'application/json' : 'application/x-www-form-urlencoded');
      options.headers.set('content-type', contentType);
      if (method && method !== 'get' && method !== 'head') {
        // GET (default) and HEAD requests can't have a body
        if (body instanceof Buffer) {
          // multipart formdata
          const form = new FormData();
          form.append('package', body, {
            filename: 'test.tar.gz',
            contentType: 'application/x-gzip',
          });
          // override headers to include content type and boundary
          options.headers = form.getHeaders({
            'Fastly-Key': options.headers.get('fastly-key'),
          });
          // set body
          options.body = form.getBuffer();// .toString();
          // console.log(options.body.toString('base64'));
        } else if (contentType === 'application/x-www-form-urlencoded') {
          // create form data
          options.body = new URLSearchParams(Object.entries(body || {})).toString();
        } else {
          // send JSON
          options.body = JSON.stringify(body);
        }
      }

      const start = Date.now();

      const reqfn = (attempt) => fetch(uri, options).then((response) => {
        const end = Date.now();
        responselog.push({ 'request-duration': end - start, headers: response.headers });

        if (!response.ok) {
          if (attempt < retries && repeat(response)) {
            return response.text().then(() => reqfn(attempt + 1));
          }
          return response.text().then((text) => {
            throw new FastlyError(response, text);
          });
        }

        return response.text().then((text) => {
          let data = text;
          try {
            data = JSON.parse(text);
            return {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              config: options,
              data,
            };
          } catch {
            return {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              config: options,
              data,
            };
          }
        });
      }).catch((reason) => {
        if (attempt < retries && repeat(reason)) {
          return reqfn(attempt + 1);
        }
        if (reason instanceof AbortError) {
          const done = new Date();
          // eslint-disable-next-line no-param-reassign
          reason.message = `Aborted ${method} request to ${path} after ${attempt} retries and ${done - start} ms: ${reason.message}`;
        }
        throw reason;
      }).finally(() => {
        if (options.signal) {
          options.signal.clear();
        }
      });
      return reqfn(0);
    };
    return memoize ? memo(myreq) : myreq;
  }

  const lock = new Lock();

  /**
   * Guards a function against concurrent execution.
   *
   * @param {Function} fn - The function to guard.
   * @returns {Function} A guarded function.
   */
  /* istanbul ignore next */
  function protect(fn) { // eslint-disable-line no-unused-vars
    return async (...args) => {
      await lock.acquire();
      try {
        return fn(...args);
      } finally {
        lock.release();
      }
    };
  }

  const client = {
    async discard() {
      return context.reset();
    },
    // remove serialization of API calls: too broad in scope

    // post: protect(makereq('post')),
    post: makereq('post'),
    get: makereq('get', true, 2),
    // put: protect(makereq('put')),
    put: makereq('put'),
    // patch: protect(makereq('patch')),
    patch: makereq('patch'),
    // delete: protect(makereq('delete')),
    delete: makereq('delete'),
    monitor: {
      get count() {
        return responselog.length;
      },

      get remaining() {
        return responselog
          .map((o) => o.headers)
          .filter((hdrs) => typeof hdrs.get('fastly-ratelimit-remaining') !== 'undefined')
          .map((hdrs) => hdrs.get('fastly-ratelimit-remaining'))
          .map((remaining) => Number.parseInt(remaining, 10))
          .pop();
      },

      get edgedurations() {
        return responselog
          .map((o) => o.headers)
          .filter((hdrs) => typeof hdrs.get('x-timer') !== 'undefined')
          .map((hdrs) => hdrs.get('x-timer'))
          .map((timer) => timer.split(',').pop())
          .map((ve) => ve.substring(2))
          .map((ve) => Number.parseInt(ve, 10));
      },

      get durations() {
        return responselog
          .filter((hdrs) => typeof hdrs['request-duration'] !== 'undefined')
          .map((hdrs) => hdrs['request-duration'])
          .map((ve) => Number.parseInt(ve, 10));
      },

      get stats() {
        const retval = {
          count: this.count,
          remaining: this.remaining,
          minduration: Math.min(...this.durations),
          maxduration: Math.max(...this.durations),
          meanduration: Math.round(this.durations.reduce((a, b) => a + b, 0)
            / this.durations.length),
          minedgeduration: Math.min(...this.edgedurations),
          maxedgeduration: Math.max(...this.edgedurations),
          meanedgeduration: Math.round(this.edgedurations.reduce((a, b) => a + b, 0)
            / this.edgedurations.length),
        };
        return retval;
      },
    },
  };

  client.get.fresh = makereq('get');
  return client;
}

module.exports = { create, FastlyError };
