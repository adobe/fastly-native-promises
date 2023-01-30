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

export default {
  readInvitations: {
    data: [
      {
        id: 'deadbeefhomusGAasOVxo7',
        type: 'invitation',
        attributes: {
          created_at: '2019-05-21T11:58:23Z',
          email: 'deadbeef@gmail.com',
          deleted_at: null,
          role: 'engineer',
          status_code: 1,
          updated_at: '2019-05-21T11:58:23Z',
          limit_services: false,
        },
        relationships: {
          customer: {
            data: {
              id: 'deadbeefY19zEASHfCMNSu',
              type: 'customer',
            },
          },
        },
      },
      {
        id: 'deadbeefG60UQidrVmP5C',
        type: 'invitation',
        attributes: {
          created_at: '2019-05-03T14:26:39Z',
          email: 'deadbeef@gmail.com',
          deleted_at: null,
          role: 'engineer',
          status_code: 1,
          updated_at: '2019-05-03T14:26:39Z',
          limit_services: true,
        },
        relationships: {
          customer: {
            data: {
              id: 'deadbeef19zEASHfCMNSu',
              type: 'customer',
            },
          },
        },
      },
    ],
    links: {
      last: 'https://api.fastly.com/invitations?page%5Bnumber%5D=1&page%5Bsize%5D=100',
    },
    meta: {
      current_page: 1,
      per_page: 100,
      record_count: 2,
      total_pages: 1,
    },
  },
};
