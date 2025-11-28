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
 * @typedef {object} User
 * @property {string} id - The user ID.
 * @property {string} name - The user's name.
 * @property {string} login - The user's login.
 * @property {string} customer_id - The customer ID.
 * @property {string} email_hash - The user's email hash.
 * @property {boolean} limit_services - Whether the user has limited service access.
 * @property {boolean} locked - Whether the user account is locked.
 * @property {boolean} require_new_password - Whether the user needs a new password.
 * @property {string} role - The user's role.
 * @property {boolean} two_factor_auth_enabled - Whether 2FA is enabled.
 * @property {boolean} two_factor_setup_required - Whether 2FA setup is required.
 */

/**
 * @typedef {object} Invitation
 * @property {string} id - The invitation ID.
 * @property {string} email - The email address for the invitation.
 * @property {boolean} limit_services - Whether the invitation has limited service access.
 * @property {string} role - The role for the invitation.
 * @property {string} status_code - The status code of the invitation.
 */

/**
 * @typedef {object} UserResponse
 * @property {User} data - The user object.
 * @property {number} status - HTTP status code.
 * @property {string} statusText - HTTP status text.
 * @property {object} headers - Response headers.
 */

/**
 * @typedef {object} UserListResponse
 * @property {User[]} data - Array of user objects.
 * @property {number} status - HTTP status code.
 * @property {string} statusText - HTTP status text.
 * @property {object} headers - Response headers.
 */

/**
 * @typedef {object} InvitationResponse
 * @property {Invitation|Invitation[]} data - The invitation object or array of invitations.
 * @property {number} status - HTTP status code.
 * @property {string} statusText - HTTP status text.
 * @property {object} headers - Response headers.
 */

/**
 * @typedef {object} DeleteResponse
 * @property {object} data - Response data confirming deletion.
 * @property {number} status - HTTP status code.
 * @property {string} statusText - HTTP status text.
 * @property {object} headers - Response headers.
 */

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
   * @returns {Promise<UserResponse>} Details of the currently authenticated user.
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
   * @returns {Promise<UserListResponse>} List of all users for the customer account.
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
   * @returns {Promise<UserResponse>} Details of the specified user.
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
   * @returns {Promise<UserResponse>} The newly created user object.
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
   * @returns {Promise<InvitationResponse>} List of all pending invitations for the customer
   *   account.
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
   * @returns {Promise<InvitationResponse>} The newly created invitation object.
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
   * @returns {Promise<InvitationResponse>} Confirmation of invitation acceptance.
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
   * @returns {Promise<DeleteResponse>} Confirmation of invitation deletion.
   */
  async deleteInvitation(id) {
    return this.request.delete(`/invitations/${id}`);
  }
}
