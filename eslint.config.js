/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import jsdoc from 'eslint-plugin-jsdoc';
import { defineConfig, globalIgnores } from '@eslint/config-helpers';
import { recommended, source, test } from '@adobe/eslint-config-helix';

export default defineConfig([
  globalIgnores([
    'test/compute/*',
  ]),
  {
    rules: {
      // a large part of this project's files are from the original (forked) project
      // and did not come with copyright headers, so we disable the rule in order to
      // allow files without headers and prevent accidential insertion of the Adobe
      // copyright header into files that were not originally created by Adobe
      'header/header': 'off',
      'import/extensions': 0,
      strict: 0,

      'jsdoc/check-examples': 0,
      'jsdoc/check-param-names': 1,
      'jsdoc/check-tag-names': 1,
      'jsdoc/check-types': 1,
      'jsdoc/no-undefined-types': 1,
      'jsdoc/require-description': 0,
      'jsdoc/require-description-complete-sentence': 1,
      'jsdoc/require-example': 0,
      'jsdoc/require-hyphen-before-param-description': 1,
      'jsdoc/require-param': 1,
      'jsdoc/require-param-description': 1,
      'jsdoc/require-param-name': 1,
      'jsdoc/require-param-type': 1,
      'jsdoc/require-returns': 1,
      'jsdoc/require-returns-description': 1,
      'jsdoc/require-returns-type': 1,
      'jsdoc/valid-types': 1,

      // allow dangling underscores for 'fields'
      'no-underscore-dangle': ['error', { allowAfterThis: true }],
    },
    plugins: {
      import: recommended.plugins.import,
      jsdoc,
    },
    extends: [recommended],
  },
  source,
  test,
]);
