import hash from 'object-hash';

/** Helper class with high-level operations for condition-management. */
export default class Conditions {
  constructor(fastly) {
    this._fastly = fastly;
  }

  /**
   * Creates functions for multi-step creation of missing and deletion of
   * superflous conditions.
   *
   * @param {number} version - Service config version.
   * @param {string} type - Condition type, can be `REQUEST`, `RESPONSE`, or `CACHE`.
   * @param {string} commentprefix - The prefix to be used for comments.
   * @param {string} nameprefix -  - The prefix to be used for names.
   * @returns {Function[]} A pair of a create and cleanup function.
   */
  multistepupdate(version, type, commentprefix, nameprefix) {
    const conditions = (statements) => statements.map((statement) => {
      const hashable = {
        type,
        statement,
      };

      const name = `${nameprefix}-${hash(hashable)}`;
      const comment = `${commentprefix} (${hash(hashable)})`;

      return {
        name,
        comment,
        priority: '10',
        ...hashable,
      };
    });

    const create = async (...statements) => {
      const existing = (await this._fastly.readConditions(version)).data;
      // keep a list of known names in the remote service
      const existingnames = new Set(existing.map(({ name }) => name));

      const tocreate = conditions(statements)
        // only consider conditions that don't exist in the remote service
        .filter(({ name }) => !existingnames.has(name))
        // schedule each condition that does not yet exist on Fastly
        // but was passed as an argument to be created
        .map((condition) => this._fastly.createCondition(version, condition));

      await Promise.all(tocreate);

      // create a lookup map that takes the statement as key and returns the condition
      // as value

      return conditions(statements).reduce((p, condition) => {
        const q = {};
        q[condition.statement] = condition;
        return Object.assign(p, q);
      }, {});
    };

    const cleanup = async (...statements) => {
      const existing = (await this._fastly.readConditions(version)).data;
      // generate a set of known names
      const conditionnames = new Set(conditions(statements).map(({ name }) => name));

      const todelete = existing
        // only look at conditions that start with 'our' prefix
        .filter(({ name }) => name.startsWith(`${nameprefix}-`))
        // only keep those that are *not* in the list of generated names
        .filter(({ name }) => !conditionnames.has(name))
        // schedule each condition that exists on Fastly, but wasn't passed as
        // an argument for deletion
        .map(({ name }) => this._fastly.deleteCondition(version, name));

      await Promise.all(todelete);
    };

    return [create, cleanup];
  }

  update(version, type, commentprefix, nameprefix) {
    return async (...statements) => {
      const [create, cleanup] = this.multistepupdate(version, type, commentprefix, nameprefix);
      await cleanup(...statements);
      return create(...statements);
    };
  }
}
