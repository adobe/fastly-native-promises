# fastly-native-promises

## DEPRECATION WARNING

**THIS PACKAGE WILL LIKELY BE DEPRECATED IN THE NEAR FUTURE**

As soon as the official [`fastly` package on NPM](https://www.npmjs.com/package/fastly) leaves beta for version 3.0.0, this package
will be deprecated in favor of the official package and this package will no longer receive feature updates and likely be archived after Adobe migrated its own usage of this package.

---

> Native Promise based Fastly API client for Node.js

[![NPM Version](https://img.shields.io/npm/v/@adobe/fastly-native-promises.svg)](https://www.npmjs.com/package/@adobe/fastly-native-promises)
[![codecov](https://img.shields.io/codecov/c/github/adobe/fastly-native-promises.svg)](https://codecov.io/gh/adobe/fastly-native-promises)
[![CircleCI](https://img.shields.io/circleci/project/github/adobe/fastly-native-promises.svg)](https://circleci.com/gh/adobe/fastly-native-promises)
[![GitHub license](https://img.shields.io/github/license/adobe/fastly-native-promises.svg)](https://github.com/adobe/fastly-native-promises/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/adobe/fastly-native-promises.svg)](https://github.com/adobe/fastly-native-promises/issues)


## Problem

The callback-based [fastly](https://www.npmjs.com/package/fastly) package is still the most used client on [NPM](https://www.npmjs.com/). However, I needed a client which allows me to perform request sequentially and parallelly without ending up in an untamable [callback hell](http://callbackhell.com/). [Philipp Schulte's fastly-native-promises](https://github.com/philippschulte/fastly-native-promises) client seemed almost perfect, except:

- it uses Axios, which is an additional dependency we'd like to avoid, especially when running inside Adobe I/O Runtime
- it has been missing features and pull requests were merged only slowly

This fork addresses the concerns above but breaks compatibility with Browsers, so that it can only be used in Node JS environments.

## Solution

The `fastly-native-promises` package uses the promise-based HTTP client [Request-Promise-Native](https://github.com/request/request-promise-native) to perform requests to the [Fastly](https://docs.fastly.com/api/) API. [Request-Promise-Native](https://github.com/request/request-promise-native) supports the native JavaScript [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API and automatically transforms the data into JSON. Each `fastly-native-promises` API method returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which represents either the completion or failure of the request.

## Table of Contents

- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Tests](#tests)
- [Contribute](#contribute)
- [License](#license)

## Security

You'll need a [Fastly API Token](https://docs.fastly.com/api/auth#tokens) to use the `fastly-native-promises` library. I recommend using a token with [global scope](https://docs.fastly.com/api/auth#access) to be able to use all `fastly-native-promises` API methods.

## Install

This is a [Node.js](https://nodejs.org/) module available through the [npm registry](https://www.npmjs.com/). Installation is done using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @adobe/fastly-native-promises
```

## Changes

See the [changelog](CHANGELOG.md).

## Usage

```javascript
import fastly from '@adobe/fastly-native-promises';

// create one or more instances
const service_1 = fastly('token', 'service_id_1');
const serivce_2 = fastly('token', 'service_id_2');

// make changes

service_1.transact(async () => {
  return this.writeS3('test-s3', {
    name: 'test-s3',
    bucket_name: 'my_corporate_bucket',
    access_key: 'AKIAIOSFODNN7EXAMPLE',
    secret_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  });
});


service_2.transact(async () => {
  return this.writeBigquery('test-bq', {
    name: 'test-bq',
    format: '{\n "timestamp":"%{begin:%Y-%m-%dT%H:%M:%S}t",\n  "time_elapsed":%{time.elapsed.usec}V,\n  "is_tls":%{if(req.is_ssl, "true", "false")}V,\n  "client_ip":"%{req.http.Fastly-Client-IP}V",\n  "geo_city":"%{client.geo.city}V",\n  "geo_country_code":"%{client.geo.country_code}V",\n  "request":"%{req.request}V",\n  "host":"%{req.http.Fastly-Orig-Host}V",\n  "url":"%{json.escape(req.url)}V",\n  "request_referer":"%{json.escape(req.http.Referer)}V",\n  "request_user_agent":"%{json.escape(req.http.User-Agent)}V",\n  "request_accept_language":"%{json.escape(req.http.Accept-Language)}V",\n  "request_accept_charset":"%{json.escape(req.http.Accept-Charset)}V",\n  "cache_status":"%{regsub(fastly_info.state, "^(HIT-(SYNTH)|(HITPASS|HIT|MISS|PASS|ERROR|PIPE)).*", "\\\\2\\\\3") }V"\n}',
    user: 'fastly-bigquery-log@example-fastly-log.iam.gserviceaccount.com',
    project_id: 'example-fastly-log',
    dataset: 'fastly_log_test',
    table: 'fastly_logs',
    template_suffix: null,
    secret_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7bPG9yaIYd5AL\nmvOaYvNozFJB/VWS53KWBll769kJvlmgMks6r6Xrv8w6rjxWKjZeDrnXVf7UDa0F\nckPPIFvXRxahftWFMGArw0lIvQzgT4/BlndXU5RNxfah/8m7q/GIF6oNYWzfJwvv\nzodxDUqIRH2e2JWidNRjElHuogYHLhV4O/od5pAkfDwak/ihuuh/2VA3Auwb3nph\ndX2F0JBs14oPKZUTYUUSzUQY5IMxSxYUA4Q7W4v21x1EnJt+biXOrERk1rm4ieEE\nU3WkjR5c5gvG8xcWyYod87RNFELmIhCCytI1+t5C3Em/jPsQFtLzwHpbNhdW4oEm\nn7d06n75AgMBAAECggEAWRh26lNZfOwJS5sDRlbXgu/uAnSdI1JmxC6Mhz4cVGdq\nT57Y6DLrWuA4A4UkJYm3gorZiSXWF5PQthAVb/bf8bxXY7nZYpEWhnc09SD5aAAq\nREp0vMx8aWQ709K2YUJg+zDUo7u2d3YmVH8HH5TD43c7iDFJIIsNE3N4A0p+NxZ+\nw06FFW+fz/etrWiNyhrlTsbkMbSgU+GpFFBq1pCd0ni5d1YM1rsaAaUpmkwdjgjL\noDs+M/L/HtqfEhyZNdw8JF7EJXVE1bIl7/NL0rBInhyO28FcB56t/AG5nzXKFI/c\nc+IO7d6MOOqiGRLRWZItEpnyzuV8DZo461wy1hSvqQKBgQDhSsg2cHkTrtBW8x0A\n3BwB/ygdkkxm1OIvfioT+JBneRufUPvVIM2aPZBBGKEedDAmIGn/8f9XAHhKjs8B\nEsPRgE206s4+hnrTcK7AeWWPvM9FDkrkQCoJFuJrNy9mJt8gs7AnnoBa9u/J4naW\ne1tfC8fUfsa7kdzblDhcRQ8FhwKBgQDU+N4kPzIdUuJDadd6TkBbjUNPEfZzU5+t\nIike2VSRhApxAxviUnTDsTROwJRzKik9w7gIMka8Ek+nmLNMEtds77ttcGQRdu16\n+vT1iualiCJe+/iMbl+PiJtFwhEHECLU9QfgBVS6r2lDAlZA+w6nwCRiidlrObzO\nCXqVOzN3fwKBgAsrOuu//bClHP0ChnCReO38aU+1/gWnDiOOnKVq0DXhAiaOzD1P\nqAG6hZlEkFBDMPWzq62doKv+gPgpRkfmV0DenHuYnGrrHdG3p2IxYoCSuq/QupPA\nPpU+xjDMhpQI30zuu4/rQq+/yDl4+aoSKYB3xAtb0Zxg6dMU8QpZ/hmnAoGBAIFu\nIesbcQR7O8FGkMrmxZweNNrYCtQ57R/WU/FImWm6OnJGNmsMO6Q2jJiT12RKKjg8\nOxrYGz7vTfOIDOddyAiPhXPUSyyF/3uvCrIzUUsmeeUJ8xq9dVwQ5HS3pYuKVfDg\nXYHbG4w9UJaF1A+3xEdUsYglSLouo7z/67zH9tZXAoGBAKpsdjSd3R+llaAv2HQ8\nGMlN92UTr5i9w++QMXq4qspH5NEYqz3NHbKuYthZqxEsRUZbRP50eDWU4jvxFVJl\nLBFINp6B+3AsIme0YCyOaleB/Cy0347miSinSv2I6QiH6dQxHdHzrG+x1evS/76f\nKT0KS+ySjCAEWgg4v+mjUDUV\n-----END PRIVATE KEY-----\n',
    response_condition: '',
  });

  // optional, but speeds up end of process
  await service_1.discard();
  await service_2.discard();
});
```

### Promises

Purge all domains of the active version:

1. Get all the versions.
2. Filter out the active version.
3. Get all the domains for the active version.
4. Purge all the domains.
5. Log the status text for each purge request.

```javascript
import fastly from '@adobe/fastly-native-promises';

const service = fastly('token', 'service_id');

function handler() {
  service.readVersions()
    .then(versions => {
      const active = versions.data.filter(version => version.active)[0];
      return service.readDomains(active.number);
    })
    .then(domains => {
      return Promise.all(domains.data.map(domain => service.purgeIndividual(domain.name)));
    })
    .then(purges => {
      purges.forEach(purge => console.log(purge.statusText));
    })
    .catch(e => {
      console.log('Shoot!');
    });
}
```

### Async/Await

Update `first_byte_timeout` property for every backend and service if the value is less than 5000 milliseconds:

1.  Get all the services associated with the Fastly API token.
2.  Filter out the service IDs.
3.  Iterate over all services synchronously.
4.  Get all the versions.
5.  Filter out the active version.
6.  Get all the backends for the active version.
7.  Filter out the affected backends.
8.  Continue with the next service if there are no affected backends.
9.  Clone the active version.
10. Update all the affected backends parallelly.
11. Activate the cloned version.

```javascript
import fastly from '@adobe/fastly-native-promises';

const account = fastly('token');

async function handler() {
  try {
    const services = await account.readServices();
    const ids = services.data.map(service => service.id);

    for (const id of ids) {
      const service = fastly('token', id);
      const versions = await service.readVersions();
      const active = versions.data.filter(version => version.active)[0];
      const backends = await service.readBackends(active.number);
      const affected = backends.data.filter(backend => backend.first_byte_timeout < 5000);

      if (!affected.length) continue;

      const clone = await service.cloneVersion(active.number);
      await Promise.all(affected.map(backend => service.updateBackend(clone.data.number, backend.name, { first_byte_timeout: 5000 })));
      await service.activateVersion(clone.data.number);
    }
  } catch (e) {
    console.log('Shoot!');
  }
}
```

### Response Schema

Each `fastly-native-promises` API method returns the following response object:

```javascript
{
  // the HTTP status code from the server response
  status: 200,

  // the HTTP status message from the server response
  statusText: 'OK',

  // the headers that the server responded with
  headers: {},

  // the options that were provided to request for the request
  config: {},

  // the request that generated the response
  request: {},

  // the response that was provided by the server
  data: {}
}
```

## Retrieving Request Statistics

The `Fastly` instance has a `requestmonitor` property that can be used to retrieve request statistics:

- `requestmonitor.count` for the total number of requests.
- `requestmonitor.remaining` for the number of requests remaining according to Fastly's API Rate limit for the hour or `undefined` (if no modifying requests have been made yet).
- `requestmonitor.edgedurations` for an array of API processing durations (in milliseconds, measured from the edge).
- `requestmonitor.durations` for an array of request durations (in milliseconds, measured from the client, i.e. including network latency).

With `requestmonitor.stats` you can get all of that in one object, including minimum, maximum and mean durations for all requests.

## Guarding against Rate Limits

Using the `requestmonitor.remaining` property, you can make sure that you still have sufficient requests before you hit the rate limit.

When using the `instance.transact` method, you can furthermore provide a minimum for the necessary available request limit so that after the initial cloning of the version no additional requests will be made if the API rate limit will be exceeded. This allows you to fail fast in case of rate limit issues.

## High-Level Helpers

While most functionality is a low-level wrapper of the Fastly, API, we provide a couple of higher-level helper functions in properties of the `Fastly` instance.

### Conditions Helper in `fastly.conditions`

The conditions helper eases the creation and management of conditions.

```javascript

const fastly = require('fastly-native-promises');

const instance = fastly('mykey', 'service-config');

const update = fastly.conditions.update(1, 'REQUEST', 'Created as an Example', 'example');

const conditions = await update('req.url.basename == "new.html"', 'req.url.basename == "index.html"');

console.log('Created a condition matching index.html with following name', conditions['req.url.basename == "index.html"'].name);

```

`fastly.conditions.update` can be called with the parameters `version` (service config version), `type` (condition type, either `REQUEST`, `RESPONSE`, or `CACHE`), `comment` (a comment that will be visible in the Fastly UI), `nameprefix` (a common prefix for the condition name) to get a new function `update` that performs the update.

When `update` is called with a list of `statements` in VCL condition language, it will synchronize the list of conditions passed in with the conditions that already exist in the Fastly service config. All conditions that share the same `nameprefix`, but are no longer used get deleted, new conditions that don't exist yet will get created (unchanged conditions aren't touched, reducing the number of requests made upon updates).

The return value of `update` is an object that maps condition statement to the condition object. This allows re-using the condition in other Fastly API calls.

### Header Helper in `fastly.headers`

The headers helper eases the creation and management of conditional headers.

```javascript
import fastly from '@adobe/fastly-native-promises';

const instance = fastly('mykey', 'service-config');

const update = fastly.headers.update(
  1,
  'REQUEST', // apply a request condition
  'Created as an Example', // use following comment for conditions
  'example', // name-prefix for all generated conditions and headers
  'set', // set the header
  'http.Location' // which header (Location)
  'request' // in the request handling
  );

await update(
    {
      condition: 'req.url.basename == "new.html"',
      expression: '"https://new.example.com"',
    },
    {
      condition: 'req.url.basename == "index.html"',
      expression: 'https://www.example.com',
    });
```

`fastly.headers.update` can be called with the parameters `version` (service config version), `type` (condition type, either `REQUEST`, `RESPONSE`, or `CACHE`), `comment` (a comment that will be visible in the Fastly UI), `nameprefix` (a common prefix for the condition name), `action` (what to do with the header, can be `set`, `append`, or `delete`), `header` (the name of the header – remember to include `http.` in the value), `sub` (the subroutine where the header is applied, can be `request`, `fetch`, `cache`, or `response`) to get a new function `update` that performs the update.

When `update` is called with a list of `objects` that looks like `{ condition: 'req.url ~ "foo/(.*)/bar"', expression: '"bar/" + re.group.1 + "/foo"'}`, i.e. pairs of a `condition` (in VCL condition language) and an `expression` (also valid VCL), it will synchronize the list of headers (and resultant conditions) passed in with the headers and conditions that already exist in the Fastly service config. All conditions and headers that share the same `nameprefix`, but are no longer used get deleted, new conditions and headers that don't exist yet will get created (unchanged conditions and headers aren't touched, reducing the number of requests made upon updates).

## API

### Functions

<dl>
<dt><a href="#readCurrentUser">readCurrentUser()</a> ⇒ <code>Promise</code></dt>
<dd><p>Get the currently logged in user.</p>
</dd>
<dt><a href="#readUsers">readUsers()</a> ⇒ <code>Promise</code></dt>
<dd><p>Get a list of all users from the current customer.</p>
</dd>
<dt><a href="#readUser">readUser(id)</a> ⇒ <code>Promise</code></dt>
<dd><p>Get the the user with the specific id.</p>
</dd>
<dt><a href="#createUser">createUser(name, login)</a> ⇒ <code>Promise</code></dt>
<dd><p>Create a user.</p>
</dd>
<dt><a href="#readInvitations">readInvitations()</a> ⇒ <code>Promise</code></dt>
<dd><p>List all invitations.</p>
</dd>
<dt><a href="#createInvitation">createInvitation(email, role)</a> ⇒ <code>Promise</code></dt>
<dd><p>Create an invitation.</p>
</dd>
<dt><a href="#acceptInvitation">acceptInvitation(acceptCode, name, password)</a> ⇒ <code>Promise</code></dt>
<dd><p>Accept an invitation.</p>
</dd>
<dt><a href="#deleteInvitation">deleteInvitation(id)</a> ⇒ <code>Promise</code></dt>
<dd><p>Delete an invitation.</p>
</dd>
<dt><a href="#readTokens">readTokens([customerId])</a> ⇒ <code>Promise</code></dt>
<dd><p>List all tokens of a customer.</p>
</dd>
<dt><a href="#readToken">readToken([id])</a> ⇒ <code>Promise</code></dt>
<dd><p>Get the token with the specified id. If the Id is missing, the self token is returned.</p>
</dd>
<dt><a href="#deleteToken">deleteToken([id])</a> ⇒ <code>Promise</code></dt>
<dd><p>Delete the token with the specified id.</p>
</dd>
<dt><a href="#createToken">createToken(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Create an API token.</p>
</dd>
<dt><a href="#domainCheck">domainCheck(version, name)</a> ⇒ <code>Promise</code></dt>
<dd><p>Checks the status of all domains for a particular service and version.</p>
</dd>
<dt><a href="#domainCheckAll">domainCheckAll(version)</a> ⇒ <code>Promise</code></dt>
<dd><p>Checks the status of all domains for a particular service and version.</p>
</dd>
<dt><a href="#readDomains">readDomains(version)</a> ⇒ <code>Promise</code></dt>
<dd><p>List all the domains for a particular service and version.</p>
</dd>
<dt><a href="#readDomain">readDomain(version, name)</a> ⇒ <code>Promise</code></dt>
<dd><p>List all the domains for a particular service and version.</p>
</dd>
<dt><a href="#readServiceDomains">readServiceDomains([serviceId])</a> ⇒ <code>Promise</code></dt>
<dd><p>List the domains within a service.</p>
</dd>
<dt><a href="#createDomain">createDomain(version, name, comment)</a> ⇒ <code>Promise</code></dt>
<dd><p>Create a domain for a particular service and version.</p>
</dd>
<dt><a href="#updateDomain">updateDomain(version, oldName, name, comment)</a> ⇒ <code>Promise</code></dt>
<dd><p>Update a domain for a particular service and version.</p>
</dd>
<dt><a href="#deleteDomain">deleteDomain(version, name)</a> ⇒ <code>Promise</code></dt>
<dd><p>Delete the domain for a particular service and version.</p>
</dd>
<dt><a href="#readHealthchecks">readHealthchecks(version)</a> ⇒ <code>Promise</code></dt>
<dd><p>List all healthchecks for a particular service and version.</p>
</dd>
<dt><a href="#readHealthcheck">readHealthcheck(version, name)</a> ⇒ <code>Promise</code></dt>
<dd><p>Get details of a single named healthcheck.</p>
</dd>
<dt><a href="#createHealthcheck">createHealthcheck(version, data)</a> ⇒ <code>Promise</code></dt>
<dd><p>Create a healthcheck for a particular service and version.</p>
</dd>
<dt><a href="#updateHealthcheck">updateHealthcheck(version, name, data)</a> ⇒ <code>Promise</code></dt>
<dd><p>Update the healthcheck for a particular service and version.</p>
</dd>
<dt><a href="#deleteHealthcheck">deleteHealthcheck(version, name)</a> ⇒ <code>Promise</code></dt>
<dd><p>Delete the healthcheck for a particular service and version.</p>
</dd>
<dt><a href="#readPackage">readPackage(version)</a> ⇒ <code>Promise</code></dt>
<dd><p>Get metadata about a package. The metadata is extracted from the package contents.</p>
</dd>
<dt><a href="#writePackage">writePackage(version, buffer)</a> ⇒ <code>Promise</code></dt>
<dd><p>Upload a new package version. The package is a Buffer of a ZIP file containing the
manifest as well as the main WASM file.</p>
</dd>
<dt><a href="#purgeIndividual">purgeIndividual(url)</a> ⇒ <code>Promise</code></dt>
<dd><p>Instant Purge an individual URL.</p>
</dd>
<dt><a href="#purgeAll">purgeAll()</a> ⇒ <code>Promise</code></dt>
<dd><p>Instant Purge everything from a service.</p>
</dd>
<dt><a href="#purgeKey">purgeKey(key)</a> ⇒ <code>Promise</code></dt>
<dd><p>Instant Purge a particular service of items tagged with a Surrogate Key.</p>
</dd>
<dt><a href="#purgeKeys">purgeKeys(keys)</a> ⇒ <code>Promise</code></dt>
<dd><p>Instant Purge a particular service of items tagged with Surrogate Keys in a batch.</p>
</dd>
<dt><a href="#softPurgeIndividual">softPurgeIndividual(url)</a> ⇒ <code>Promise</code></dt>
<dd><p>Soft Purge an individual URL.</p>
</dd>
<dt><a href="#softPurgeKey">softPurgeKey(key)</a> ⇒ <code>Promise</code></dt>
<dd><p>Soft Purge a particular service of items tagged with a Surrogate Key.</p>
</dd>
<dt><a href="#softPurgeKeys">softPurgeKeys(keys)</a> ⇒ <code>Promise</code></dt>
<dd><p>Soft Purge a particular service of items tagged with Surrogate Keys in a batch.</p>
</dd>
<dt><a href="#multistepupdate">multistepupdate(version, type, commentprefix, nameprefix)</a> ⇒ <code>Array.&lt;function()&gt;</code></dt>
<dd><p>Creates functions for multi-step creation of missing and deletion of
superflous conditions.</p>
</dd>
<dt><a href="#update">update(version, type, commentprefix, nameprefix, action, header, sub)</a> ⇒ <code>Array.&lt;function()&gt;</code></dt>
<dd><p>Creates functions for multi-step creation of missing and deletion of
superflous conditional headers.</p>
</dd>
<dt><a href="#repeat">repeat(responseOrError)</a> ⇒ <code>boolean</code></dt>
<dd><p>Determines if a response or error indicates that the response is repeatable.</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#CreateFunction">CreateFunction</a> ⇒ <code>Promise</code></dt>
<dd><p>A function that creates a resource of a specific type. If a resource of that
name already exists, it will reject the returned promise with an error.</p>
</dd>
<dt><a href="#UpdateFunction">UpdateFunction</a> ⇒ <code>Promise</code></dt>
<dd><p>A function that updates an already existing resource of a specific type.
If no resource of that name exists, it will reject the returned promise with an error.</p>
</dd>
<dt><a href="#ReadFunction">ReadFunction</a> ⇒ <code>Promise</code></dt>
<dd><p>A function that retrieves a representation of a resource of a specific type.
If no resource of that name exists, it will reject the returned promise with an error.</p>
</dd>
<dt><a href="#ListFunction">ListFunction</a> ⇒ <code>Promise</code></dt>
<dd><p>A function that retrieves a list of resources of a specific type.</p>
</dd>
<dt><a href="#FastlyError">FastlyError</a> : <code>object</code></dt>
<dd><p>The FastlyError class describes the most common errors that can occur
when working with the Fastly API. Using <code>error.status</code>, the underlying
HTTP status code can be retrieved. Known error status codes include:</p>
<ul>
<li>400: attempting to activate invalid VCL</li>
<li>401: invalid credentials</li>
<li>404: resource not found</li>
<li>409: confict when trying to POST a resource that already exists</li>
<li>422: attempting to modify a service config that is not checked out</li>
<li>429: rate limit exceeded, try again later</li>
</ul>
</dd>
<dt><a href="#Response">Response</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Versions">Versions</a> : <code>object</code></dt>
<dd><p>Describes the most relevant versions of the service.</p>
</dd>
<dt><a href="#DictUpdate">DictUpdate</a> : <code>object</code></dt>
<dd><p>Specifies a dictionary update operation. In most cases, <code>upsert</code> is the best way
to update values, as it will work for existing and non-existing items.</p>
</dd>
<dt><a href="#Snippet">Snippet</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ResponseObject">ResponseObject</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#VCL">VCL</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="readCurrentUser"></a>

### readCurrentUser() ⇒ <code>Promise</code>
Get the currently logged in user.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#user_91db9d9178f3f4c7597899942bd3f941  
<a name="readUsers"></a>

### readUsers() ⇒ <code>Promise</code>
Get a list of all users from the current customer.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#customer_12f4a69627ba3bbb1c8668aae03a60ad  
<a name="readUser"></a>

### readUser(id) ⇒ <code>Promise</code>
Get the the user with the specific id.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#user_15a6c72980b9434ebb8253c7e882c26c  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The User ID. |

<a name="createUser"></a>

### createUser(name, login) ⇒ <code>Promise</code>
Create a user.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#user_00b606002596bac1c652614de98bd260  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The user name. |
| login | <code>string</code> | The user login. |

<a name="readInvitations"></a>

### readInvitations() ⇒ <code>Promise</code>
List all invitations.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#invitations_6d8623de97ed7e50b7b6498e374bb657  
<a name="createInvitation"></a>

### createInvitation(email, role) ⇒ <code>Promise</code>
Create an invitation.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#invitations_8c4da3ca11c75facd36cfaad024bd891  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| email | <code>string</code> |  | The email address for the invitation. |
| role | <code>string</code> | <code>&quot;engineer&quot;</code> | The user role. Defaults to {@code engineer}. |

<a name="acceptInvitation"></a>

### acceptInvitation(acceptCode, name, password) ⇒ <code>Promise</code>
Accept an invitation.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  

| Param | Type | Description |
| --- | --- | --- |
| acceptCode | <code>string</code> | The accept code retrieved in the email. |
| name | <code>string</code> | Name for the new user. |
| password | <code>string</code> | Password for the new user. |

<a name="deleteInvitation"></a>

### deleteInvitation(id) ⇒ <code>Promise</code>
Delete an invitation.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#invitations_d70a7460c7e1bd8dd660c6f5b3558c2e  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The invitation id. |

<a name="readTokens"></a>

### readTokens([customerId]) ⇒ <code>Promise</code>
List all tokens of a customer.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/auth#tokens_d59ff8612bae27a2317278abb048db0c  

| Param | Type | Description |
| --- | --- | --- |
| [customerId] | <code>string</code> | The id of the customer. |

<a name="readToken"></a>

### readToken([id]) ⇒ <code>Promise</code>
Get the token with the specified id. If the Id is missing, the self token is returned.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/auth#tokens_bb00e7ed542cbcd7f32b5c908b8ce244  

| Param | Type | Description |
| --- | --- | --- |
| [id] | <code>string</code> | The token id. |

<a name="deleteToken"></a>

### deleteToken([id]) ⇒ <code>Promise</code>
Delete the token with the specified id.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/auth#tokens_4a958ba69402500937f0d8570f7ce86f  

| Param | Type | Description |
| --- | --- | --- |
| [id] | <code>string</code> | The token id. |

<a name="createToken"></a>

### createToken(options) ⇒ <code>Promise</code>
Create an API token.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/auth#tokens_db4655a45a0107448eb0676577446e40  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The token options. |

<a name="domainCheck"></a>

### domainCheck(version, name) ⇒ <code>Promise</code>
Checks the status of all domains for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_30a3f14c9a0ce5730757d39983ab7dc6  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the domain. |

<a name="domainCheckAll"></a>

### domainCheckAll(version) ⇒ <code>Promise</code>
Checks the status of all domains for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_e33a599694c3316f00b6b8d53a2db7d9  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

**Example**  
```js
instance.domainCheckAll('182')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="readDomains"></a>

### readDomains(version) ⇒ <code>Promise</code>
List all the domains for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_6d340186666771f022ca20f81609d03d  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

**Example**  
```js
instance.readDomains('182')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="readDomain"></a>

### readDomain(version, name) ⇒ <code>Promise</code>
List all the domains for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_f1b5fab17a0729daeeaf7594b47759c5  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The domain name. |

<a name="readServiceDomains"></a>

### readServiceDomains([serviceId]) ⇒ <code>Promise</code>
List the domains within a service.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#service_d5578a1e3bc75512711ddd0a58ce7a36  

| Param | Type | Description |
| --- | --- | --- |
| [serviceId] | <code>string</code> | The service id. |

<a name="createDomain"></a>

### createDomain(version, name, comment) ⇒ <code>Promise</code>
Create a domain for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_90345101274774ff1b84f0a7dd010b01  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The domain name. |
| comment | <code>string</code> | Optional comment. |

<a name="updateDomain"></a>

### updateDomain(version, oldName, name, comment) ⇒ <code>Promise</code>
Update a domain for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_2ef42bd9b4c56c86b46dc0e36096ab10  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| oldName | <code>string</code> | The old name of the domain. |
| name | <code>string</code> | The domain name. |
| comment | <code>string</code> | Optional comment. |

<a name="deleteDomain"></a>

### deleteDomain(version, name) ⇒ <code>Promise</code>
Delete the domain for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_aab5a322f58df2b1db8dc276e8594a70  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The domain name. |

<a name="readHealthchecks"></a>

### readHealthchecks(version) ⇒ <code>Promise</code>
List all healthchecks for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_126cb37382d68583269420ba772ded36  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

<a name="readHealthcheck"></a>

### readHealthcheck(version, name) ⇒ <code>Promise</code>
Get details of a single named healthcheck.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_b54ea357a2377e62ae7649e609b94966  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the healthcheck. |

<a name="createHealthcheck"></a>

### createHealthcheck(version, data) ⇒ <code>Promise</code>
Create a healthcheck for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_8712be8923dd419c54393da3ac31f6d3  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| data | <code>object</code> | The healthcheck definition. |

<a name="updateHealthcheck"></a>

### updateHealthcheck(version, name, data) ⇒ <code>Promise</code>
Update the healthcheck for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_9a60b6005125c4afeaa80111e69d7586  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the healthcheck to update. |
| data | <code>object</code> | The healthcheck definition. |

<a name="deleteHealthcheck"></a>

### deleteHealthcheck(version, name) ⇒ <code>Promise</code>
Delete the healthcheck for a particular service and version.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_a22900c40a2fd59db5028061dc5dfa36  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the healthcheck to delete. |

<a name="readPackage"></a>

### readPackage(version) ⇒ <code>Promise</code>
Get metadata about a package. The metadata is extracted from the package contents.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object.  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

<a name="writePackage"></a>

### writePackage(version, buffer) ⇒ <code>Promise</code>
Upload a new package version. The package is a Buffer of a ZIP file containing the
manifest as well as the main WASM file.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object.  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The service version to update. |
| buffer | <code>Buffer</code> | The package contents as a Buffer. |

<a name="purgeIndividual"></a>

### purgeIndividual(url) ⇒ <code>Promise</code>
Instant Purge an individual URL.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/purge#purge_3aa1d66ee81dbfed0b03deed0fa16a9a  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to purge. |

**Example**  
```js
instance.purgeIndividual('www.example.com')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="purgeAll"></a>

### purgeAll() ⇒ <code>Promise</code>
Instant Purge everything from a service.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/purge#purge_bee5ed1a0cfd541e8b9f970a44718546  
**Example**  
```js
instance.purgeAll()
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="purgeKey"></a>

### purgeKey(key) ⇒ <code>Promise</code>
Instant Purge a particular service of items tagged with a Surrogate Key.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/purge#purge_d8b8e8be84c350dd92492453a3df3230  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The surrogate key to purge. |

**Example**  
```js
instance.purgeKey('key_1')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="purgeKeys"></a>

### purgeKeys(keys) ⇒ <code>Promise</code>
Instant Purge a particular service of items tagged with Surrogate Keys in a batch.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/purge#purge_db35b293f8a724717fcf25628d713583  

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Array</code> | The array of surrogate keys to purge. |

**Example**  
```js
instance.purgeKeys(['key_2', 'key_3', 'key_4'])
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="softPurgeIndividual"></a>

### softPurgeIndividual(url) ⇒ <code>Promise</code>
Soft Purge an individual URL.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/purge#soft_purge_0c4f56f3d68e9bed44fb8b638b78ea36  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to soft purge. |

**Example**  
```js
instance.softPurgeIndividual('www.example.com/images')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="softPurgeKey"></a>

### softPurgeKey(key) ⇒ <code>Promise</code>
Soft Purge a particular service of items tagged with a Surrogate Key.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/purge#soft_purge_2e4d29085640127739f8467f27a5b549  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The surrogate key to soft purge. |

**Example**  
```js
instance.softPurgeKey('key_5')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="softPurgeKeys"></a>

### softPurgeKeys(keys) ⇒ <code>Promise</code>
Soft Purge a particular service of items tagged with Surrogate Keys in a batch.

**Kind**: global function  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/purge#purge_db35b293f8a724717fcf25628d713583  

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Array</code> | The array of surrogate keys to purge. |

**Example**  
```js
instance.softPurgeKeys(['key_2', 'key_3', 'key_4'])
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="multistepupdate"></a>

### multistepupdate(version, type, commentprefix, nameprefix) ⇒ <code>Array.&lt;function()&gt;</code>
Creates functions for multi-step creation of missing and deletion of
superflous conditions.

**Kind**: global function  
**Returns**: <code>Array.&lt;function()&gt;</code> - A pair of a create and cleanup function.  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | Service config version. |
| type | <code>string</code> | Condition type, can be `REQUEST`, `RESPONSE`, or `CACHE`. |
| commentprefix | <code>string</code> | The prefix to be used for comments. |
| nameprefix | <code>string</code> | - The prefix to be used for names. |

<a name="update"></a>

### update(version, type, commentprefix, nameprefix, action, header, sub) ⇒ <code>Array.&lt;function()&gt;</code>
Creates functions for multi-step creation of missing and deletion of
superflous conditional headers.

**Kind**: global function  
**Returns**: <code>Array.&lt;function()&gt;</code> - A pair of a create and cleanup function.  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | Service config version. |
| type | <code>string</code> | Condition type, can be `REQUEST`, `RESPONSE`, or `CACHE`. |
| commentprefix | <code>string</code> | The prefix to be used for comments. |
| nameprefix | <code>string</code> | - The prefix to be used for names. |
| action | <code>string</code> | What do do with the header, can be `set`, `append`, `delete`. |
| header | <code>string</code> | The name of the header to set. |
| sub | <code>string</code> | Name of the subroutine where the header should be applied, can be `request`, `fetch`, `cache`, or `response`. |

<a name="repeat"></a>

### repeat(responseOrError) ⇒ <code>boolean</code>
Determines if a response or error indicates that the response is repeatable.

**Kind**: global function  
**Returns**: <code>boolean</code> - - True, if another attempt can be made.  

| Param | Type | Description |
| --- | --- | --- |
| responseOrError | <code>object</code> | – the error response or error object. |

<a name="CreateFunction"></a>

### CreateFunction ⇒ <code>Promise</code>
A function that creates a resource of a specific type. If a resource of that
name already exists, it will reject the returned promise with an error.

**Kind**: global typedef  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**Throws**:

- [<code>FastlyError</code>](#FastlyError) 


| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The service config version to operate on. Needs to be checked out. |
| data | <code>object</code> | The data object describing the resource to be created. |
| data.name | <code>string</code> | The name of the resource to be created. |

<a name="UpdateFunction"></a>

### UpdateFunction ⇒ <code>Promise</code>
A function that updates an already existing resource of a specific type.
If no resource of that name exists, it will reject the returned promise with an error.

**Kind**: global typedef  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**Throws**:

- [<code>FastlyError</code>](#FastlyError) 


| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The service config version to operate on. Needs to be checked out. |
| name | <code>string</code> | The name of the resource to be updated. The old name in case of renaming something. |
| data | <code>object</code> | The data object describing the resource to be updated. |
| data.name | <code>string</code> | The new name of the resource to be updated. |

<a name="ReadFunction"></a>

### ReadFunction ⇒ <code>Promise</code>
A function that retrieves a representation of a resource of a specific type.
If no resource of that name exists, it will reject the returned promise with an error.

**Kind**: global typedef  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**Throws**:

- [<code>FastlyError</code>](#FastlyError) 


| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The service config version to operate on. Needs to be checked out. |
| name | <code>string</code> | The name of the resource to be retrieved. |

<a name="ListFunction"></a>

### ListFunction ⇒ <code>Promise</code>
A function that retrieves a list of resources of a specific type.

**Kind**: global typedef  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**Throws**:

- [<code>FastlyError</code>](#FastlyError) 


| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The service config version to operate on. Needs to be checked out. |

<a name="FastlyError"></a>

### FastlyError : <code>object</code>
The FastlyError class describes the most common errors that can occur
when working with the Fastly API. Using `error.status`, the underlying
HTTP status code can be retrieved. Known error status codes include:
- 400: attempting to activate invalid VCL
- 401: invalid credentials
- 404: resource not found
- 409: confict when trying to POST a resource that already exists
- 422: attempting to modify a service config that is not checked out
- 429: rate limit exceeded, try again later

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| status | <code>number</code> | The HTTP status code from the server response, e.g. 200. |
| data | <code>object</code> | The parsed body of the HTTP response. |
| code | <code>string</code> | A short error message. |
| message | <code>string</code> | A more detailed error message. |

<a name="Response"></a>

### Response : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| status | <code>number</code> | The HTTP status code from the server response, e.g. 200. |
| statusText | <code>string</code> | The HTTP status text, e.g. 'OK'. |
| headers | <code>object</code> | The HTTP headers of the reponse. |
| config | <code>object</code> | The original request configuration used for the HTTP client. |
| request | <code>object</code> | The HTTP request. |
| data | <code>object</code> | The parsed body of the HTTP response. |

<a name="Versions"></a>

### Versions : <code>object</code>
Describes the most relevant versions of the service.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| latest | <code>number</code> | The latest version of the service. |
| active | <code>number</code> | The currently active version number. |
| current | <code>number</code> | The latest editable version number. |

<a name="DictUpdate"></a>

### DictUpdate : <code>object</code>
Specifies a dictionary update operation. In most cases, `upsert` is the best way
to update values, as it will work for existing and non-existing items.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| op | <code>string</code> | The operation: `create`, `update`, `delete`, or `upsert`. |
| item_key | <code>string</code> | The lookup key. |
| item_value | <code>string</code> | The dictionary value. |

<a name="Snippet"></a>

### Snippet : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the snippet, as visible in the Fastly UI. |
| content | <code>string</code> | The VCL body of the snippet. |

<a name="ResponseObject"></a>

### ResponseObject : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the synthetic response, as visible in the Fastly UI. |
| content | <code>string</code> | The body of the response. |
| content_type | <code>string</code> | The content type. |
| status | <code>number</code> | Http status code. |
| request_condition | <code>string</code> | Name of a request condition. |

<a name="VCL"></a>

### VCL : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the VCL, as visible in the Fastly UI. Note: setting the name to 'main' here won't make it the main VCL, unless you also call `setMainVCL`. |
| content | <code>string</code> | The VCL body of the custom VCL. |


## Tests

To run the test suite, first install the dependencies, then run the [`npm test` command](https://docs.npmjs.com/cli/test):

```bash
$ npm install
$ npm test
```

## Contribute

PRs accepted. I am open to suggestions in improving this library. Commit by:

```bash
$ npm run commit
```

## License

Licensed under the [MIT License](LICENSE) © 2017 Philipp Schulte

