import hash from 'object-hash';

const typemap = {
  REQUEST: 'request_condition',
  RESPONSE: 'response_condition',
  CACHE: 'cache_condition',
};

/** Helper class with high-level operations for condition-management. */
export default class Headers {
  constructor(fastly) {
    this._fastly = fastly;
  }

  /**
   * Creates functions for multi-step creation of missing and deletion of
   * superflous conditional headers.
   *
   * @param {number} version - Service config version.
   * @param {string} type - Condition type, can be `REQUEST`, `RESPONSE`, or `CACHE`.
   * @param {string} commentprefix - The prefix to be used for comments.
   * @param {string} nameprefix -  - The prefix to be used for names.
   * @param {string} action - What do do with the header, can be `set`, `append`, `delete`.
   * @param {string} header - The name of the header to set.
   * @param {string} sub - Name of the subroutine where the header
   * should be applied, can be `request`, `fetch`, `cache`, or `response`.
   * @returns {Function[]} A pair of a create and cleanup function.
   */
  update(version, type, commentprefix, nameprefix, action, header, sub) {
    const makeheaders = (headers, namedcondition) => headers.map(({ condition, expression }) => {
      const hashable = {
        type: sub,
        action,
        dst: header,
        src: expression,
      };

      // set `request_condition` etc. to the *name* that corresponds to the condition statement
      hashable[typemap[type]] = namedcondition[condition].name;

      const name = `${nameprefix}-${hash(hashable)}`;

      return {
        name,
        priority: '10',
        ...hashable,
      };
    });

    const [
      createconditions,
      cleanupconditions] = this._fastly.conditions.multistepupdate(
      version,
      type,
      commentprefix,
      nameprefix,
    );

    // each header is a tuple like this:
    // `{ condition: 'req.url ~ "foo/(.*)/bar"', expression: '"bar/" + re.group.1 + "/foo"'}`
    // this function extracts the condition bit.
    const conditions = (headers) => headers.map(({ condition }) => condition);

    // this function takes care of the creation of new headers by looking
    // at existing headers and finding ones that are missing from the service
    const createheaders = async (...headers) => {
      const jobs = [];
      // get the map of condition statements to condition names
      const namedconditions = await createconditions(...conditions(headers));

      const existing = (await this._fastly.readHeaders(version)).data;
      // keep a list of known names in the remote service
      const existingnames = new Set(existing.map(({ name }) => name));

      const headernames = makeheaders(headers, namedconditions);
      const headernameset = new Set(headernames.map(({ name }) => name));

      const headerstobecreated = headernames
        // only consider conditions that don't exist in the remote service
        .filter(({ name }) => !existingnames.has(name))
        // schedule each condition that does not yet exist on Fastly
        // but was passed as an argument to be created
        .map((h) => this._fastly.createHeader(version, h));

      // all headers need to be created
      jobs.push(headerstobecreated);

      const todelete = existing
        // only look at headers that start with 'our' prefix
        .filter(({ name }) => name.startsWith(`${nameprefix}-`))
        // only keep those that are *not* in the list of generated names
        .filter(({ name }) => !headernameset.has(name))
        // only consider those for deletetion where type, action, and dst do match
        .filter((h) => h.type === sub)
        .filter((h) => h.action === action)
        .filter((h) => h.dst === header);

      // schedule each remaining header that exists on Fastly, but wasn't passed as
      // an argument for deletion
      jobs.push(todelete.map(({ name }) => this._fastly.deleteHeader(version, name)));

      jobs.push(todelete);
      // finally, clean up the conditions we no longer need
      jobs.push(cleanupconditions(...conditions(headers)));

      // return a promise that waits for the creation of all headers
      return Promise.all(jobs);
    };

    return createheaders;
  }
}
