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
import { axiosCreate } from './httpclient.js';
import config from './config.js';

/**
 * The Fastly Account API.
 *
 * @see https://docs.fastly.com/api/account#top
 * @type {AccountAPI}
 */
export default class AccountAPI {
  constructor(base) {
    this.base = base;
    this.defaultOptions = {
      baseURL: config.mainEntryPoint,
      timeout: 15000,
      headers: {},
    };
  }

  get request() {
    return this.base.request;
  }

  /**
   * Get the currently logged in user.
   *
   * @see https://docs.fastly.com/api/account#user_91db9d9178f3f4c7597899942bd3f941
   * @returns {Promise} The response object representing the completion or failure.
   */
  async readCurrentUser() {
    if (!this._currentUser) {
      this._currentUser = await this.request.get('/current_user');
    }
    return this._currentUser;
  }

  /**
   * Get a list of all users from the current customer.
   *
   * @see https://docs.fastly.com/api/account#customer_12f4a69627ba3bbb1c8668aae03a60ad
   * @returns {Promise} The response object representing the completion or failure.
   */
  async readUsers() {
    const id = (await this.readCurrentUser()).data.customer_id;
    return this.request.get(`/customer/${id}/users`);
  }

  /**
   * Get the the user with the specific id.
   *
   * @see https://docs.fastly.com/api/account#user_15a6c72980b9434ebb8253c7e882c26c
   * @param {string} id - The User ID.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async readUser(id) {
    return this.request.get(`/users/${id}`);
  }

  /**
   * Create a user.
   *
   * @see https://docs.fastly.com/api/account#user_00b606002596bac1c652614de98bd260
   * @param {string} name - The user name.
   * @param {string} login - The user login.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async createUser(name, login) {
    return this.request.post('/user', {
      name,
      login,
    });
  }

  /**
   * List all invitations.
   *
   * @see https://docs.fastly.com/api/account#invitations_6d8623de97ed7e50b7b6498e374bb657
   * @returns {Promise} The response object representing the completion or failure.
   */
  async readInvitations() {
    return this.request.get('/invitations');
  }

  /**
   * Create an invitation.
   *
   * @see https://docs.fastly.com/api/account#invitations_8c4da3ca11c75facd36cfaad024bd891
   * @param {string} email - The email address for the invitation.
   * @param {string} role - The user role. Defaults to `'engineer'`.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async createInvitation(email, role = 'engineer') {
    const id = (await this.readCurrentUser()).data.customer_id;
    return this.request.post('/invitations', {
      data: {
        type: 'invitation',
        attributes: {
          email,
          limit_services: true,
          role,
        },
        relationships: {
          customer: {
            data: {
              id,
              type: 'customer',
            },
          },
        },
      },
    }, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  /**
   * Accept an invitation.
   *
   * @param {string} acceptCode - The accept code retrieved in the email.
   * @param {string} name - Name for the new user.
   * @param {string} password - Password for the new user.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async acceptInvitation(acceptCode, name, password) {
    // send PUT w/o authentication.
    const rp = axiosCreate({ ...this.defaultOptions });
    return rp.put(`/invitation/accept/${acceptCode}`, {
      marketing_opt_in: false,
      name,
      password,
    }, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  /**
   * Delete an invitation.
   *
   * @see https://docs.fastly.com/api/account#invitations_d70a7460c7e1bd8dd660c6f5b3558c2e
   * @param {string} id - The invitation id.
   * @returns {Promise} The response object representing the completion or failure.
   */
  async deleteInvitation(id) {
    return this.request.delete(`/invitations/${id}`);
  }
}
