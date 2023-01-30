/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

export function toString(schema) {
  if (typeof schema === 'object') {
    return `{${Object
      .entries(schema)
      .map(([key, value]) => ` "${key}": ${toString(value)}`).join(', ')} }`;
  }
  return schema;
}

export function concat(...args) {
  return args.map(toString).join('');
}

export function vcl([expr]) {
  return `%{json.escape(${expr})}V`;
}

export function str(expr) {
  return `"${expr}"`;
}

export function time([expr]) {
  return `%{${expr}}t`;
}

export function req([expr]) {
  return `"%{${expr}}i"`;
}

export function res([expr]) {
  return `"%{${expr}}o"`;
}
