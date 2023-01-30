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

### Classes

<dl>
<dt><a href="#AccountAPI">AccountAPI</a> : <code><a href="#AccountAPI">AccountAPI</a></code></dt>
<dd><p>The Fastly Account API.</p>
</dd>
<dt><a href="#AuthAPI">AuthAPI</a> : <code><a href="#AuthAPI">AuthAPI</a></code></dt>
<dd><p>The Fastly Auth API.</p>
</dd>
<dt><a href="#DomainAPI">DomainAPI</a> : <code><a href="#DomainAPI">DomainAPI</a></code></dt>
<dd><p>The Fastly Domain API.</p>
</dd>
<dt><a href="#HealthcheckAPI">HealthcheckAPI</a> : <code><a href="#HealthcheckAPI">HealthcheckAPI</a></code></dt>
<dd><p>The Fastly Healthcheck API.</p>
</dd>
<dt><a href="#PurgeAPI">PurgeAPI</a> : <code><a href="#PurgeAPI">PurgeAPI</a></code></dt>
<dd><p>The Fastly Purge API.</p>
</dd>
<dt><a href="#Conditions">Conditions</a></dt>
<dd><p>Helper class with high-level operations for condition-management.</p>
</dd>
<dt><a href="#Headers">Headers</a></dt>
<dd><p>Helper class with high-level operations for condition-management.</p>
</dd>
<dt><a href="#Fastly">Fastly</a></dt>
<dd></dd>
</dl>

### Functions

<dl>
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
<dt><a href="#VCL">VCL</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="AccountAPI"></a>

### AccountAPI : [<code>AccountAPI</code>](#AccountAPI)
The Fastly Account API.

**Kind**: global class  
**See**: https://docs.fastly.com/api/account#top  

* [AccountAPI](#AccountAPI) : [<code>AccountAPI</code>](#AccountAPI)
    * [.readCurrentUser()](#AccountAPI+readCurrentUser) ⇒ <code>Promise</code>
    * [.readUsers()](#AccountAPI+readUsers) ⇒ <code>Promise</code>
    * [.readUser(id)](#AccountAPI+readUser) ⇒ <code>Promise</code>
    * [.createUser(name, login)](#AccountAPI+createUser) ⇒ <code>Promise</code>
    * [.readInvitations()](#AccountAPI+readInvitations) ⇒ <code>Promise</code>
    * [.createInvitation(email, role)](#AccountAPI+createInvitation) ⇒ <code>Promise</code>
    * [.acceptInvitation(acceptCode, name, password)](#AccountAPI+acceptInvitation) ⇒ <code>Promise</code>
    * [.deleteInvitation(id)](#AccountAPI+deleteInvitation) ⇒ <code>Promise</code>

<a name="AccountAPI+readCurrentUser"></a>

#### accountAPI.readCurrentUser() ⇒ <code>Promise</code>
Get the currently logged in user.

**Kind**: instance method of [<code>AccountAPI</code>](#AccountAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#user_91db9d9178f3f4c7597899942bd3f941  
<a name="AccountAPI+readUsers"></a>

#### accountAPI.readUsers() ⇒ <code>Promise</code>
Get a list of all users from the current customer.

**Kind**: instance method of [<code>AccountAPI</code>](#AccountAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#customer_12f4a69627ba3bbb1c8668aae03a60ad  
<a name="AccountAPI+readUser"></a>

#### accountAPI.readUser(id) ⇒ <code>Promise</code>
Get the the user with the specific id.

**Kind**: instance method of [<code>AccountAPI</code>](#AccountAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#user_15a6c72980b9434ebb8253c7e882c26c  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The User ID. |

<a name="AccountAPI+createUser"></a>

#### accountAPI.createUser(name, login) ⇒ <code>Promise</code>
Create a user.

**Kind**: instance method of [<code>AccountAPI</code>](#AccountAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#user_00b606002596bac1c652614de98bd260  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The user name. |
| login | <code>string</code> | The user login. |

<a name="AccountAPI+readInvitations"></a>

#### accountAPI.readInvitations() ⇒ <code>Promise</code>
List all invitations.

**Kind**: instance method of [<code>AccountAPI</code>](#AccountAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#invitations_6d8623de97ed7e50b7b6498e374bb657  
<a name="AccountAPI+createInvitation"></a>

#### accountAPI.createInvitation(email, role) ⇒ <code>Promise</code>
Create an invitation.

**Kind**: instance method of [<code>AccountAPI</code>](#AccountAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#invitations_8c4da3ca11c75facd36cfaad024bd891  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| email | <code>string</code> |  | The email address for the invitation. |
| role | <code>string</code> | <code>&quot;engineer&quot;</code> | The user role. Defaults to {@code engineer}. |

<a name="AccountAPI+acceptInvitation"></a>

#### accountAPI.acceptInvitation(acceptCode, name, password) ⇒ <code>Promise</code>
Accept an invitation.

**Kind**: instance method of [<code>AccountAPI</code>](#AccountAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  

| Param | Type | Description |
| --- | --- | --- |
| acceptCode | <code>string</code> | The accept code retrieved in the email. |
| name | <code>string</code> | Name for the new user. |
| password | <code>string</code> | Password for the new user. |

<a name="AccountAPI+deleteInvitation"></a>

#### accountAPI.deleteInvitation(id) ⇒ <code>Promise</code>
Delete an invitation.

**Kind**: instance method of [<code>AccountAPI</code>](#AccountAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/account#invitations_d70a7460c7e1bd8dd660c6f5b3558c2e  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The invitation id. |

<a name="AuthAPI"></a>

### AuthAPI : [<code>AuthAPI</code>](#AuthAPI)
The Fastly Auth API.

**Kind**: global class  
**See**: https://docs.fastly.com/api/auth#top  

* [AuthAPI](#AuthAPI) : [<code>AuthAPI</code>](#AuthAPI)
    * [.readTokens([customerId])](#AuthAPI+readTokens) ⇒ <code>Promise</code>
    * [.readToken([id])](#AuthAPI+readToken) ⇒ <code>Promise</code>
    * [.deleteToken([id])](#AuthAPI+deleteToken) ⇒ <code>Promise</code>
    * [.createToken(options)](#AuthAPI+createToken) ⇒ <code>Promise</code>

<a name="AuthAPI+readTokens"></a>

#### authAPI.readTokens([customerId]) ⇒ <code>Promise</code>
List all tokens of a customer.

**Kind**: instance method of [<code>AuthAPI</code>](#AuthAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/auth#tokens_d59ff8612bae27a2317278abb048db0c  

| Param | Type | Description |
| --- | --- | --- |
| [customerId] | <code>string</code> | The id of the customer. |

<a name="AuthAPI+readToken"></a>

#### authAPI.readToken([id]) ⇒ <code>Promise</code>
Get the token with the specified id. If the Id is missing, the self token is returned.

**Kind**: instance method of [<code>AuthAPI</code>](#AuthAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/auth#tokens_bb00e7ed542cbcd7f32b5c908b8ce244  

| Param | Type | Description |
| --- | --- | --- |
| [id] | <code>string</code> | The token id. |

<a name="AuthAPI+deleteToken"></a>

#### authAPI.deleteToken([id]) ⇒ <code>Promise</code>
Delete the token with the specified id.

**Kind**: instance method of [<code>AuthAPI</code>](#AuthAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/auth#tokens_4a958ba69402500937f0d8570f7ce86f  

| Param | Type | Description |
| --- | --- | --- |
| [id] | <code>string</code> | The token id. |

<a name="AuthAPI+createToken"></a>

#### authAPI.createToken(options) ⇒ <code>Promise</code>
Create an API token.

**Kind**: instance method of [<code>AuthAPI</code>](#AuthAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/auth#tokens_db4655a45a0107448eb0676577446e40  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The token options. |

<a name="DomainAPI"></a>

### DomainAPI : [<code>DomainAPI</code>](#DomainAPI)
The Fastly Domain API.

**Kind**: global class  
**See**: https://docs.fastly.com/api/config#domain  

* [DomainAPI](#DomainAPI) : [<code>DomainAPI</code>](#DomainAPI)
    * [.domainCheck(version, name)](#DomainAPI+domainCheck) ⇒ <code>Promise</code>
    * [.domainCheckAll(version)](#DomainAPI+domainCheckAll) ⇒ <code>Promise</code>
    * [.readDomains(version)](#DomainAPI+readDomains) ⇒ <code>Promise</code>
    * [.readDomain(version, name)](#DomainAPI+readDomain) ⇒ <code>Promise</code>
    * [.readServiceDomains([serviceId])](#DomainAPI+readServiceDomains) ⇒ <code>Promise</code>
    * [.createDomain(version, name, comment)](#DomainAPI+createDomain) ⇒ <code>Promise</code>
    * [.updateDomain(version, oldName, name, comment)](#DomainAPI+updateDomain) ⇒ <code>Promise</code>
    * [.deleteDomain(version, name)](#DomainAPI+deleteDomain) ⇒ <code>Promise</code>

<a name="DomainAPI+domainCheck"></a>

#### domainAPI.domainCheck(version, name) ⇒ <code>Promise</code>
Checks the status of all domains for a particular service and version.

**Kind**: instance method of [<code>DomainAPI</code>](#DomainAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_30a3f14c9a0ce5730757d39983ab7dc6  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the domain. |

<a name="DomainAPI+domainCheckAll"></a>

#### domainAPI.domainCheckAll(version) ⇒ <code>Promise</code>
Checks the status of all domains for a particular service and version.

**Kind**: instance method of [<code>DomainAPI</code>](#DomainAPI)  
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
<a name="DomainAPI+readDomains"></a>

#### domainAPI.readDomains(version) ⇒ <code>Promise</code>
List all the domains for a particular service and version.

**Kind**: instance method of [<code>DomainAPI</code>](#DomainAPI)  
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
<a name="DomainAPI+readDomain"></a>

#### domainAPI.readDomain(version, name) ⇒ <code>Promise</code>
List all the domains for a particular service and version.

**Kind**: instance method of [<code>DomainAPI</code>](#DomainAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_f1b5fab17a0729daeeaf7594b47759c5  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The domain name. |

<a name="DomainAPI+readServiceDomains"></a>

#### domainAPI.readServiceDomains([serviceId]) ⇒ <code>Promise</code>
List the domains within a service.

**Kind**: instance method of [<code>DomainAPI</code>](#DomainAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#service_d5578a1e3bc75512711ddd0a58ce7a36  

| Param | Type | Description |
| --- | --- | --- |
| [serviceId] | <code>string</code> | The service id. |

<a name="DomainAPI+createDomain"></a>

#### domainAPI.createDomain(version, name, comment) ⇒ <code>Promise</code>
Create a domain for a particular service and version.

**Kind**: instance method of [<code>DomainAPI</code>](#DomainAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_90345101274774ff1b84f0a7dd010b01  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The domain name. |
| comment | <code>string</code> | Optional comment. |

<a name="DomainAPI+updateDomain"></a>

#### domainAPI.updateDomain(version, oldName, name, comment) ⇒ <code>Promise</code>
Update a domain for a particular service and version.

**Kind**: instance method of [<code>DomainAPI</code>](#DomainAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_2ef42bd9b4c56c86b46dc0e36096ab10  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| oldName | <code>string</code> | The old name of the domain. |
| name | <code>string</code> | The domain name. |
| comment | <code>string</code> | Optional comment. |

<a name="DomainAPI+deleteDomain"></a>

#### domainAPI.deleteDomain(version, name) ⇒ <code>Promise</code>
Delete the domain for a particular service and version.

**Kind**: instance method of [<code>DomainAPI</code>](#DomainAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#domain_aab5a322f58df2b1db8dc276e8594a70  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The domain name. |

<a name="HealthcheckAPI"></a>

### HealthcheckAPI : [<code>HealthcheckAPI</code>](#HealthcheckAPI)
The Fastly Healthcheck API.

**Kind**: global class  
**See**: https://docs.fastly.com/api/config#healthcheck  

* [HealthcheckAPI](#HealthcheckAPI) : [<code>HealthcheckAPI</code>](#HealthcheckAPI)
    * [.readHealthchecks(version)](#HealthcheckAPI+readHealthchecks) ⇒ <code>Promise</code>
    * [.readHealthcheck(version, name)](#HealthcheckAPI+readHealthcheck) ⇒ <code>Promise</code>
    * [.createHealthcheck(version, data)](#HealthcheckAPI+createHealthcheck) ⇒ <code>Promise</code>
    * [.updateHealthcheck(version, name, data)](#HealthcheckAPI+updateHealthcheck) ⇒ <code>Promise</code>
    * [.deleteHealthcheck(version, name)](#HealthcheckAPI+deleteHealthcheck) ⇒ <code>Promise</code>

<a name="HealthcheckAPI+readHealthchecks"></a>

#### healthcheckAPI.readHealthchecks(version) ⇒ <code>Promise</code>
List all healthchecks for a particular service and version.

**Kind**: instance method of [<code>HealthcheckAPI</code>](#HealthcheckAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_126cb37382d68583269420ba772ded36  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

<a name="HealthcheckAPI+readHealthcheck"></a>

#### healthcheckAPI.readHealthcheck(version, name) ⇒ <code>Promise</code>
Get details of a single named healthcheck.

**Kind**: instance method of [<code>HealthcheckAPI</code>](#HealthcheckAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_b54ea357a2377e62ae7649e609b94966  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the healthcheck. |

<a name="HealthcheckAPI+createHealthcheck"></a>

#### healthcheckAPI.createHealthcheck(version, data) ⇒ <code>Promise</code>
Create a healthcheck for a particular service and version.

**Kind**: instance method of [<code>HealthcheckAPI</code>](#HealthcheckAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_8712be8923dd419c54393da3ac31f6d3  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| data | <code>object</code> | The healthcheck definition. |

<a name="HealthcheckAPI+updateHealthcheck"></a>

#### healthcheckAPI.updateHealthcheck(version, name, data) ⇒ <code>Promise</code>
Update the healthcheck for a particular service and version.

**Kind**: instance method of [<code>HealthcheckAPI</code>](#HealthcheckAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_9a60b6005125c4afeaa80111e69d7586  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the healthcheck to update. |
| data | <code>object</code> | The healthcheck definition. |

<a name="HealthcheckAPI+deleteHealthcheck"></a>

#### healthcheckAPI.deleteHealthcheck(version, name) ⇒ <code>Promise</code>
Delete the healthcheck for a particular service and version.

**Kind**: instance method of [<code>HealthcheckAPI</code>](#HealthcheckAPI)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#healthcheck_a22900c40a2fd59db5028061dc5dfa36  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the healthcheck to delete. |

<a name="PurgeAPI"></a>

### PurgeAPI : [<code>PurgeAPI</code>](#PurgeAPI)
The Fastly Purge API.

**Kind**: global class  
**See**: https://docs.fastly.com/api/purge#purge  

* [PurgeAPI](#PurgeAPI) : [<code>PurgeAPI</code>](#PurgeAPI)
    * [.purgeIndividual(url)](#PurgeAPI+purgeIndividual) ⇒ <code>Promise</code>
    * [.purgeAll()](#PurgeAPI+purgeAll) ⇒ <code>Promise</code>
    * [.purgeKey(key)](#PurgeAPI+purgeKey) ⇒ <code>Promise</code>
    * [.purgeKeys(keys)](#PurgeAPI+purgeKeys) ⇒ <code>Promise</code>
    * [.softPurgeIndividual(url)](#PurgeAPI+softPurgeIndividual) ⇒ <code>Promise</code>
    * [.softPurgeKey(key)](#PurgeAPI+softPurgeKey) ⇒ <code>Promise</code>
    * [.softPurgeKeys(keys)](#PurgeAPI+softPurgeKeys) ⇒ <code>Promise</code>

<a name="PurgeAPI+purgeIndividual"></a>

#### purgeAPI.purgeIndividual(url) ⇒ <code>Promise</code>
Instant Purge an individual URL.

**Kind**: instance method of [<code>PurgeAPI</code>](#PurgeAPI)  
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
<a name="PurgeAPI+purgeAll"></a>

#### purgeAPI.purgeAll() ⇒ <code>Promise</code>
Instant Purge everything from a service.

**Kind**: instance method of [<code>PurgeAPI</code>](#PurgeAPI)  
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
<a name="PurgeAPI+purgeKey"></a>

#### purgeAPI.purgeKey(key) ⇒ <code>Promise</code>
Instant Purge a particular service of items tagged with a Surrogate Key.

**Kind**: instance method of [<code>PurgeAPI</code>](#PurgeAPI)  
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
<a name="PurgeAPI+purgeKeys"></a>

#### purgeAPI.purgeKeys(keys) ⇒ <code>Promise</code>
Instant Purge a particular service of items tagged with Surrogate Keys in a batch.

**Kind**: instance method of [<code>PurgeAPI</code>](#PurgeAPI)  
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
<a name="PurgeAPI+softPurgeIndividual"></a>

#### purgeAPI.softPurgeIndividual(url) ⇒ <code>Promise</code>
Soft Purge an individual URL.

**Kind**: instance method of [<code>PurgeAPI</code>](#PurgeAPI)  
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
<a name="PurgeAPI+softPurgeKey"></a>

#### purgeAPI.softPurgeKey(key) ⇒ <code>Promise</code>
Soft Purge a particular service of items tagged with a Surrogate Key.

**Kind**: instance method of [<code>PurgeAPI</code>](#PurgeAPI)  
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
<a name="PurgeAPI+softPurgeKeys"></a>

#### purgeAPI.softPurgeKeys(keys) ⇒ <code>Promise</code>
Soft Purge a particular service of items tagged with Surrogate Keys in a batch.

**Kind**: instance method of [<code>PurgeAPI</code>](#PurgeAPI)  
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
<a name="Conditions"></a>

### Conditions
Helper class with high-level operations for condition-management.

**Kind**: global class  
<a name="Conditions+multistepupdate"></a>

#### conditions.multistepupdate(version, type, commentprefix, nameprefix) ⇒ <code>Array.&lt;function()&gt;</code>
Creates functions for multi-step creation of missing and deletion of
superflous conditions.

**Kind**: instance method of [<code>Conditions</code>](#Conditions)  
**Returns**: <code>Array.&lt;function()&gt;</code> - A pair of a create and cleanup function.  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | Service config version. |
| type | <code>string</code> | Condition type, can be `REQUEST`, `RESPONSE`, or `CACHE`. |
| commentprefix | <code>string</code> | The prefix to be used for comments. |
| nameprefix | <code>string</code> | - The prefix to be used for names. |

<a name="Headers"></a>

### Headers
Helper class with high-level operations for condition-management.

**Kind**: global class  
<a name="Headers+update"></a>

#### headers.update(version, type, commentprefix, nameprefix, action, header, sub) ⇒ <code>Array.&lt;function()&gt;</code>
Creates functions for multi-step creation of missing and deletion of
superflous conditional headers.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
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

<a name="Fastly"></a>

### Fastly
**Kind**: global class  

* [Fastly](#Fastly)
    * [new Fastly(token, service_id, timeout)](#new_Fastly_new)
    * [.readLogsFn(service)](#Fastly+readLogsFn) ⇒ [<code>ListFunction</code>](#ListFunction)
    * [.readLogFn(service)](#Fastly+readLogFn) ⇒ [<code>ReadFunction</code>](#ReadFunction)
    * [.createLogFn(service)](#Fastly+createLogFn) ⇒ [<code>CreateFunction</code>](#CreateFunction)
    * [.updateLogFn(service)](#Fastly+updateLogFn) ⇒ [<code>UpdateFunction</code>](#UpdateFunction)
    * [.upsertFn(createFn, updateFn, readFn)](#Fastly+upsertFn) ⇒ [<code>UpdateFunction</code>](#UpdateFunction)
    * [.discard()](#Fastly+discard)
    * [.dataCenters()](#Fastly+dataCenters) ⇒ <code>Promise</code>
    * [.publicIpList()](#Fastly+publicIpList) ⇒ <code>Promise</code>
    * [.edgeCheck(url)](#Fastly+edgeCheck) ⇒ <code>Promise</code>
    * [.readServices()](#Fastly+readServices) ⇒ <code>Promise</code>
    * [.readServicesById()](#Fastly+readServicesById) ⇒ <code>Promise</code>
    * [.readService([serviceId])](#Fastly+readService) ⇒ <code>Promise</code>
    * [.readVersions()](#Fastly+readVersions) ⇒ <code>Promise</code>
    * [.getVersions()](#Fastly+getVersions) ⇒ [<code>Versions</code>](#Versions)
    * [.cloneVersion(version)](#Fastly+cloneVersion) ⇒ <code>Promise</code>
    * [.activateVersion(version)](#Fastly+activateVersion) ⇒ <code>Promise</code>
    * [.readDictItems(version, name)](#Fastly+readDictItems) ⇒ <code>Promise</code>
    * [.readDictItem(version, name, key)](#Fastly+readDictItem) ⇒ <code>Promise</code>
    * [.createDictItem(version, name, key, value)](#Fastly+createDictItem) ⇒ <code>Promise</code>
    * [.bulkUpdateDictItems(version, name, ...items)](#Fastly+bulkUpdateDictItems) ⇒ <code>Promise</code>
    * [.updateDictItem(version, name, key, value)](#Fastly+updateDictItem) ⇒ <code>Promise</code>
    * [.deleteDictItem(version, name, key)](#Fastly+deleteDictItem) ⇒ <code>Promise</code>
    * [.writeDictItem(version, name, key, value)](#Fastly+writeDictItem) ⇒ <code>Promise</code>
    * [.readDictionaries(version)](#Fastly+readDictionaries) ⇒ <code>Promise</code>
    * [.readDictionary(version, name)](#Fastly+readDictionary) ⇒ <code>Promise</code>
    * [.createDictionary(version, data)](#Fastly+createDictionary) ⇒ <code>Promise</code>
    * [.updateDictionary(version, name, data)](#Fastly+updateDictionary) ⇒ <code>Promise</code>
    * [.deleteDictionary(version, name)](#Fastly+deleteDictionary) ⇒ <code>Promise</code>
    * [.readConditions(version)](#Fastly+readConditions) ⇒ <code>Promise</code>
    * [.readCondition(version, name)](#Fastly+readCondition) ⇒ <code>Promise</code>
    * [.readSnippet(version, name)](#Fastly+readSnippet) ⇒ <code>Promise</code>
    * [.createCondition(version, data)](#Fastly+createCondition) ⇒ <code>Promise</code>
    * [.updateCondition(version, name, data)](#Fastly+updateCondition) ⇒ <code>Promise</code>
    * [.deleteCondition(version, name)](#Fastly+deleteCondition) ⇒ <code>Promise</code>
    * [.readHeaders(version)](#Fastly+readHeaders) ⇒ <code>Promise</code>
    * [.readHeader(version, name)](#Fastly+readHeader) ⇒ <code>Promise</code>
    * [.createHeader(version, data)](#Fastly+createHeader) ⇒ <code>Promise</code>
    * [.updateHeader(version, name, data)](#Fastly+updateHeader) ⇒ <code>Promise</code>
    * [.deleteHeader(version, name)](#Fastly+deleteHeader) ⇒ <code>Promise</code>
    * [.readBackends(version)](#Fastly+readBackends) ⇒ <code>Promise</code>
    * [.updateBackend(version, name, data)](#Fastly+updateBackend) ⇒ <code>Promise</code>
    * [.createBackend(version, data)](#Fastly+createBackend) ⇒ <code>Promise</code>
    * [.readSnippets(version)](#Fastly+readSnippets) ⇒ <code>Promise</code>
    * [.createSnippet(version, data)](#Fastly+createSnippet) ⇒ <code>Promise</code>
    * [.updateSnippet(version, name, data)](#Fastly+updateSnippet) ⇒ <code>Promise</code>
    * [.createVCL(version, data)](#Fastly+createVCL) ⇒ <code>Promise</code>
    * [.updateVCL(version, name, data)](#Fastly+updateVCL) ⇒ <code>Promise</code>
    * [.setMainVCL(version, name)](#Fastly+setMainVCL) ⇒ <code>Promise</code>
    * [.transact(operations, activate, limit)](#Fastly+transact) ⇒ <code>object</code>
    * [.dryrun(operations)](#Fastly+dryrun) ⇒ <code>object</code>

<a name="new_Fastly_new"></a>

#### new Fastly(token, service_id, timeout)
The constructor method for creating a fastly-promises instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| token | <code>string</code> |  | The Fastly API token. |
| service_id | <code>string</code> |  | The Fastly service ID. |
| timeout | <code>number</code> | <code>15000</code> | HTTP timeout for requests to the Fastly API, default: 15 seconds. |

<a name="Fastly+readLogsFn"></a>

#### fastly.readLogsFn(service) ⇒ [<code>ListFunction</code>](#ListFunction)
Create a new function that lists all log configurations for a given service
and version. The function can be parametrized with the name of the logging
service.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: [<code>ListFunction</code>](#ListFunction) - A logging function.  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>string</code> | The id of the logging service. Supported services are: s3, s3canary, azureblob, cloudfiles, digitalocean, ftp, bigquery, gcs, honeycomb, logshuttle, logentries, loggly, heroku, https, openstack, papertrail, scalyr, splunk, sumologic, syslog. |

<a name="Fastly+readLogFn"></a>

#### fastly.readLogFn(service) ⇒ [<code>ReadFunction</code>](#ReadFunction)
Create a new function that returns a named log configuration for a given service
and version. The function can be parametrized with the name of the logging
service.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: [<code>ReadFunction</code>](#ReadFunction) - A logging function.  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>string</code> | The id of the logging service. Supported services are: s3, s3canary, azureblob, cloudfiles, digitalocean, ftp, bigquery, gcs, honeycomb, logshuttle, logentries, loggly, heroku, https, openstack, papertrail, scalyr, splunk, sumologic, syslog. |

<a name="Fastly+createLogFn"></a>

#### fastly.createLogFn(service) ⇒ [<code>CreateFunction</code>](#CreateFunction)
Create a new function that creates a named log configuration for a given service
and version. The function can be parametrized with the name of the logging
service.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: [<code>CreateFunction</code>](#CreateFunction) - A logging function.  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>string</code> | The id of the logging service. Supported services are: s3, s3canary, azureblob, cloudfiles, digitalocean, ftp, bigquery, gcs, honeycomb, logshuttle, logentries, loggly, heroku, https, openstack, papertrail, scalyr, splunk, sumologic, syslog. |

<a name="Fastly+updateLogFn"></a>

#### fastly.updateLogFn(service) ⇒ [<code>UpdateFunction</code>](#UpdateFunction)
Create a new function that updates a named log configuration for a given service
and version. The function can be parametrized with the name of the logging
service.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: [<code>UpdateFunction</code>](#UpdateFunction) - A logging function.  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>string</code> | The id of the logging service. Supported services are: s3, s3canary, azureblob, cloudfiles, digitalocean, ftp, bigquery, gcs, honeycomb, logshuttle, logentries, loggly, heroku, https, openstack, papertrail, scalyr, splunk, sumologic, syslog. |

<a name="Fastly+upsertFn"></a>

#### fastly.upsertFn(createFn, updateFn, readFn) ⇒ [<code>UpdateFunction</code>](#UpdateFunction)
Creates an update-or-create or "safe create" function that will either create
(if it does not exist) or update (if it does) a named resource. The function
will attempt to check if the resource exists first (if a reader function has been
provided), alternatively, it will just blindly create and fall back with an
update.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: [<code>UpdateFunction</code>](#UpdateFunction) - An update function that does not fail on conflict.  

| Param | Type | Description |
| --- | --- | --- |
| createFn | [<code>CreateFunction</code>](#CreateFunction) | A function that creates a resource. |
| updateFn | [<code>UpdateFunction</code>](#UpdateFunction) | A function that updates a resource. |
| readFn | [<code>ReadFunction</code>](#ReadFunction) | An optional function that checks for the existence of a resource. |

<a name="Fastly+discard"></a>

#### fastly.discard()
Free resources bound to the HTTP client (pending sessions/sockets)
and allow the node process to quit.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - A promise which resolves when all resources have been freed.  
<a name="Fastly+dataCenters"></a>

#### fastly.dataCenters() ⇒ <code>Promise</code>
Get a list of all Fastly datacenters.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/tools#datacenter_1c8d3b9dd035e301155b44eae05e0554  
**Example**  
```js
instance.dataCenters()
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+publicIpList"></a>

#### fastly.publicIpList() ⇒ <code>Promise</code>
Fastly's services IP ranges.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/tools#public_ip_list_ef2e9900a1c9522b58f5abed92ec785e  
**Example**  
```js
instance.publicIpList()
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+edgeCheck"></a>

#### fastly.edgeCheck(url) ⇒ <code>Promise</code>
Retrieve headers and MD5 hash of the content for a particular URL from each Fastly edge server.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/tools#content_4d2d4548b29c7661e17ebe7098872d6d  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Full URL (host and path) to check on all nodes. If protocol is omitted,    http will be assumed. |

**Example**  
```js
instance.edgeCheck('api.example.com')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readServices"></a>

#### fastly.readServices() ⇒ <code>Promise</code>
List all services.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#service_74d98f7e5d018256e44d1cf820388ef8  
**Example**  
```js
instance.readServices()
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readServicesById"></a>

#### fastly.readServicesById() ⇒ <code>Promise</code>
Reads the services and returns a data object that contains a map where the service id is
the key.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
<a name="Fastly+readService"></a>

#### fastly.readService([serviceId]) ⇒ <code>Promise</code>
Get a specific service by id.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#service_a884a9abd5af9723f6fcbb1ed13ae4cc  

| Param | Type | Description |
| --- | --- | --- |
| [serviceId] | <code>string</code> | The service id. |

<a name="Fastly+readVersions"></a>

#### fastly.readVersions() ⇒ <code>Promise</code>
List the versions for a particular service.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#version_dfde9093f4eb0aa2497bbfd1d9415987  
**Example**  
```js
instance.readVersions()
   .then(res => {
     const active = res.data.filter(version => version.active);
     console.log(active);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+getVersions"></a>

#### fastly.getVersions() ⇒ [<code>Versions</code>](#Versions)
Gets the version footprint for the service.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: [<code>Versions</code>](#Versions) - The latest, current, and active versions of the service.  
<a name="Fastly+cloneVersion"></a>

#### fastly.cloneVersion(version) ⇒ <code>Promise</code>
Clone the current configuration into a new version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#version_7f4937d0663a27fbb765820d4c76c709  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The version to be cloned. |

**Example**  
```js
instance.cloneVersion('45')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+activateVersion"></a>

#### fastly.activateVersion(version) ⇒ <code>Promise</code>
Activate the current version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#version_0b79ae1ba6aee61d64cc4d43fed1e0d5  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The version to be activated. |

**Example**  
```js
instance.activateVersion('23')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readDictItems"></a>

#### fastly.readDictItems(version, name) ⇒ <code>Promise</code>
List all dictionary items for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#dictionary_item_a48de28cd7e76c1ea58523f39bb7204b  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The version of the dictionary. |
| name | <code>string</code> | The name of the dictionary. |

**Example**  
```js
instance.readDictItems(1, 'my_dictionary')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readDictItem"></a>

#### fastly.readDictItem(version, name, key) ⇒ <code>Promise</code>
Get details of a single dictionary item.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#dictionary_item_08f090cd03ed4602ae63f131087e2f29  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | Name of the dictionary. |
| key | <code>string</code> | The key to retrieve values by. |

**Example**  
```js
instance.readDictItem('12', 'extensions', 'some_key')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+createDictItem"></a>

#### fastly.createDictItem(version, name, key, value) ⇒ <code>Promise</code>
Create a new dictionary item for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The reponse object.  
**See**: https://docs.fastly.com/api/config#dictionary_item_6ec455c0ba1b21671789e1362bc7fe55  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | The version number (current if omitted). |
| name | <code>object</code> | The dictionary definition. |
| key | <code>string</code> | The key. |
| value | <code>string</code> | The value to write. |

<a name="Fastly+bulkUpdateDictItems"></a>

#### fastly.bulkUpdateDictItems(version, name, ...items) ⇒ <code>Promise</code>
Updates multiple dictionary items in bulk.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object.  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | The version numer (current if ommitted). |
| name | <code>string</code> | Name of the dictionary. |
| ...items | [<code>DictUpdate</code>](#DictUpdate) | The dictionary update operations. |

**Example**  
```js
// single item
fastly.bulkUpdateDictItems(1, 'secret_dictionary',
  { item_key: 'some_key', item_value: 'some_value', op: 'upsert' });

// multiple items
fastly.bulkUpdateDictItems(1, 'secret_dictionary',
  { item_key: 'some_key', item_value: 'some_value', op: 'update' },
  { item_key: 'other_key', item_value: 'other_value', op: 'update' });
```
<a name="Fastly+updateDictItem"></a>

#### fastly.updateDictItem(version, name, key, value) ⇒ <code>Promise</code>
Update a dictionary item value for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#dictionary_item_34c884a7cdce84dfcfd38dac7a0b5bb0  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the dictionary. |
| key | <code>string</code> | The key to update data under. |
| value | <code>string</code> | The value to update the dictionary with. |

**Example**  
```js
instance.updateDictItem(1, 'extensions', 'html', 'text/html')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+deleteDictItem"></a>

#### fastly.deleteDictItem(version, name, key) ⇒ <code>Promise</code>
Delete a dictionary item for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#dictionary_item_664347e743b8eafc9a93c729d9da0427  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the dictionary. |
| key | <code>string</code> | The key to update data under. |

**Example**  
```js
instance.deleteDictItem('34', 'extensions', 'html')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+writeDictItem"></a>

#### fastly.writeDictItem(version, name, key, value) ⇒ <code>Promise</code>
Safely create, update or delete a dictionary item in a named dictionary.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | Service version to use for dictionary lookup. |
| name | <code>string</code> | Name of the dictionary (not ID). |
| key | <code>string</code> | Key to create, update or delete. |
| value | <code>string</code> | Value to update. Empty strings will delete the dictionary entry. |

<a name="Fastly+readDictionaries"></a>

#### fastly.readDictionaries(version) ⇒ <code>Promise</code>
List all dictionaries for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#dictionary_6d2cc293b994eb8c16d93e92e91f3915  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

**Example**  
```js
instance.readDictionaries('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readDictionary"></a>

#### fastly.readDictionary(version, name) ⇒ <code>Promise</code>
Get details of a single dictionary.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#dictionary_0e16df083830ed3b6c30b73dcef64014  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | Name of the dictionary. |

**Example**  
```js
instance.readDictionary('12', 'extensions')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+createDictionary"></a>

#### fastly.createDictionary(version, data) ⇒ <code>Promise</code>
Create a new dictionary for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The reponse object.  
**See**: https://docs.fastly.com/api/config#dictionary_7d48b87bf82433162a3b209292722125  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | The version number (current if omitted). |
| data | <code>object</code> | The dictionary definition. |

<a name="Fastly+updateDictionary"></a>

#### fastly.updateDictionary(version, name, data) ⇒ <code>Promise</code>
Update a dictionary for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#dictionary_8c9da370b1591d99e5389143a5589a32  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the dictionary. |
| data | <code>object</code> | The data to be sent as the request body. |

**Example**  
```js
instance.updateDictionary('34', 'old-name', { name: 'new-name' })
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+deleteDictionary"></a>

#### fastly.deleteDictionary(version, name) ⇒ <code>Promise</code>
Delete a dictionary for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#dictionary_8c9da370b1591d99e5389143a5589a32  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the dictionary. |

**Example**  
```js
instance.deleteDictionary('34', 'extensions')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readConditions"></a>

#### fastly.readConditions(version) ⇒ <code>Promise</code>
List all conditions for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#condition_b61196c572f473c89863a81cc5912861  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

**Example**  
```js
instance.readConditions('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readCondition"></a>

#### fastly.readCondition(version, name) ⇒ <code>Promise</code>
Get details of a single named condition.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#condition_149a2f48485ceb335f70504e5269b77e  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | Name of the condition. |

**Example**  
```js
instance.readCondition('12', 'returning')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readSnippet"></a>

#### fastly.readSnippet(version, name) ⇒ <code>Promise</code>
Get details of a single named snippet.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://developer.fastly.com/reference/api/vcl-services/snippet/  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | Name of the snippet. |

**Example**  
```js
instance.readSnippet('12', 'returning')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+createCondition"></a>

#### fastly.createCondition(version, data) ⇒ <code>Promise</code>
Create a new condition for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The reponse object.  
**See**: https://docs.fastly.com/api/config#condition_551199dbec2271195319b675d8659226  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | The version number (current if omitted). |
| data | <code>object</code> | The condition definition. |

<a name="Fastly+updateCondition"></a>

#### fastly.updateCondition(version, name, data) ⇒ <code>Promise</code>
Update a condition for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#condition_01a2c4e4b44943b541e001013b665deb  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the condition. |
| data | <code>object</code> | The data to be sent as the request body. |

**Example**  
```js
instance.updateCondition('34', 'returning', { name: 'returning-visitor' })
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+deleteCondition"></a>

#### fastly.deleteCondition(version, name) ⇒ <code>Promise</code>
Delete a condition for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#condition_2b902b7649c46b4541f00a920d06c94d  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the condition. |

**Example**  
```js
instance.deleteCondition('34', 'extensions')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readHeaders"></a>

#### fastly.readHeaders(version) ⇒ <code>Promise</code>
List all headers for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#header_dd9da0592b2f1ff8ef0a4c1943f8abff  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

**Example**  
```js
instance.readHeaders('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readHeader"></a>

#### fastly.readHeader(version, name) ⇒ <code>Promise</code>
Get details of a single named header.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#header_86469e5eba4e5d6b1463e81f82a847e0  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | Name of the header. |

**Example**  
```js
instance.readHeader('12', 'returning')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+createHeader"></a>

#### fastly.createHeader(version, data) ⇒ <code>Promise</code>
Create a new header for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The reponse object.  
**See**: https://docs.fastly.com/api/config#header_151df4ce647a8e222e730b260287cb39  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | The version number (current if omitted). |
| data | <code>object</code> | The header definition. |

<a name="Fastly+updateHeader"></a>

#### fastly.updateHeader(version, name, data) ⇒ <code>Promise</code>
Update a header for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#header_c4257a0fd0eb017ea47b1fbb318fd61c  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the header. |
| data | <code>object</code> | The data to be sent as the request body. |

**Example**  
```js
instance.updateHeader('34', 'returning', { name: 'returning-visitor' })
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+deleteHeader"></a>

#### fastly.deleteHeader(version, name) ⇒ <code>Promise</code>
Delete a header for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#header_4bbb73fffda4d189bf5a19b474399a83  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the header. |

**Example**  
```js
instance.deleteHeader('34', 'extensions')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+readBackends"></a>

#### fastly.readBackends(version) ⇒ <code>Promise</code>
List all backends for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#backend_fb0e875c9a7669f071cbf89ca32c7f69  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

**Example**  
```js
instance.readBackends('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+updateBackend"></a>

#### fastly.updateBackend(version, name, data) ⇒ <code>Promise</code>
Update the backend for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#backend_fb3b3529417c70f57458644f7aec652e  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the backend. |
| data | <code>object</code> | The data to be sent as the request body. |

**Example**  
```js
instance.updateBackend('34', 'slow-server', { name: 'fast-server' })
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+createBackend"></a>

#### fastly.createBackend(version, data) ⇒ <code>Promise</code>
Create a new backend for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The reponse object.  
**See**: https://docs.fastly.com/api/config#backend_85c170418ee71191dbb3b5046aeb6c2c  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>number</code> | The version number (current if omitted). |
| data | <code>object</code> | The backend definition. |

<a name="Fastly+readSnippets"></a>

#### fastly.readSnippets(version) ⇒ <code>Promise</code>
List all snippets for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#api-section-snippet  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |

**Example**  
```js
instance.readSnippets('12')
   .then(res => {
     console.log(res.data);
   })
   .catch(err => {
     console.log(err.message);
   });
```
<a name="Fastly+createSnippet"></a>

#### fastly.createSnippet(version, data) ⇒ <code>Promise</code>
Create a snippet for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#snippet_41e0e11c662d4d56adada215e707f30d  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| data | [<code>Snippet</code>](#Snippet) | The data to be sent as the request body. |

**Example**  
```js
instance.createSnippet('36', {
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
```
<a name="Fastly+updateSnippet"></a>

#### fastly.updateSnippet(version, name, data) ⇒ <code>Promise</code>
Update a VCL snippet for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the snippet to update. |
| data | [<code>Snippet</code>](#Snippet) | The data to be sent as the request body. |

<a name="Fastly+createVCL"></a>

#### fastly.createVCL(version, data) ⇒ <code>Promise</code>
Create custom VCL for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#vcl_7ade6ab5926b903b6acf3335a85060cc  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| data | [<code>VCL</code>](#VCL) | The data to be sent as the request body. |

<a name="Fastly+updateVCL"></a>

#### fastly.updateVCL(version, name, data) ⇒ <code>Promise</code>
Update custom VCL for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#vcl_0971365908e17086751c5ef2a8053087  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the VCL to update. |
| data | [<code>VCL</code>](#VCL) | The data to be sent as the request body. |

<a name="Fastly+setMainVCL"></a>

#### fastly.setMainVCL(version, name) ⇒ <code>Promise</code>
Define a custom VCL to be the main VCL for a particular service and version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>Promise</code> - The response object representing the completion or failure.  
**See**: https://docs.fastly.com/api/config#vcl_5576c38e7652f5a7261bfcad41c0faf1  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | The current version of a service. |
| name | <code>string</code> | The name of the VCL to declare main. |

<a name="Fastly+transact"></a>

#### fastly.transact(operations, activate, limit) ⇒ <code>object</code>
Creates a new version, runs the function `operations` and then
optionally activates the newly created version. This function
is useful for making modifications to a service config.

You can provide a `limit` of write operations, which is an estimate
of the number of write operations that will be attempted. If the
limit is higher than the number of actions allowed by Fastly's rate
limits, the function will fail fast after cloning the service config.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>object</code> - The return value of the wrapped function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| operations | <code>function</code> |  | A function that performs changes on the service config. |
| activate | <code>boolean</code> | <code>true</code> | Set to false to prevent automatic activation. |
| limit | <code>number</code> | <code>0</code> | Number of write operations that will be performed in this action. |

**Example**  
```javascript
await fastly.transact(async (newversion) => {
 await fastly.doSomething(newversion);
});
// new version has been activated
```
<a name="Fastly+dryrun"></a>

#### fastly.dryrun(operations) ⇒ <code>object</code>
See `transact`, but this version does not activate the created version.

**Kind**: instance method of [<code>Fastly</code>](#Fastly)  
**Returns**: <code>object</code> - Whatever `operations` returns.  
**See**: #transact  

| Param | Type | Description |
| --- | --- | --- |
| operations | <code>function</code> | The operations that should be applied to the cloned service config version. |

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
