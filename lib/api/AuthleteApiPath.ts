/*
 * Copyright (C) 2019-2024 Authlete, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the
 * License.
 */

/**
 * The base path for the pushed authentication request API.
 * @type {string}
 */
const PUSHED_AUTH_REQ_API_PATH = '/api/%d/pushed_auth_req';

/**
 * Path template for Authlete's authorization API endpoint.
 *
 * This constant represents the path template for the authorization API endpoint.
 * The '%d' placeholder should be replaced with the appropriate API version number
 * when constructing the full URL.
 *
 * @constant {string}
 */
const AUTH_AUTHORIZATION_API_PATH = '/api/%d/auth/authorization';

/**
 * Path template for Authlete's authorization failure API endpoint.
 *
 * This constant represents the path template for the authorization failure API endpoint.
 * The '%d' placeholder should be replaced with the appropriate API version number
 * when constructing the full URL.
 *
 * @constant {string}
 * @see {@link https://docs.authlete.com/#auth-authorization-fail|Authlete API Reference: /auth/authorization/fail}
 */
const AUTH_AUTHORIZATION_FAIL_API_PATH = '/api/%d/auth/authorization/fail';

/**
 * Generates the path for the pushed authentication request API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const pushedAuthReqPath = (serviceId: string) =>
  PUSHED_AUTH_REQ_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the full path for Authlete's authorization API endpoint.
 *
 * This function replaces the '%d' placeholder in the AUTH_AUTHORIZATION_API_PATH
 * with the provided service ID to create the complete API path.
 *
 * @function
 * @param {string} serviceId - The service ID to be inserted into the path.
 * @returns {string} The complete path for the authorization API endpoint.
 */
export const authorizationPath = (serviceId: string) =>
  AUTH_AUTHORIZATION_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the full path for Authlete's authorization failure API endpoint.
 *
 * This function replaces the '%d' placeholder in the AUTH_AUTHORIZATION_FAIL_API_PATH
 * with the provided service ID to create the complete API path.
 *
 * @function
 * @param {string} serviceId - The service ID to be inserted into the path.
 * @returns {string} The complete path for the authorization failure API endpoint.
 * @see {@link https://docs.authlete.com/#auth-authorization-fail|Authlete API Reference: /auth/authorization/fail}
 */
export const authorizationFailPath = (serviceId: string) =>
  AUTH_AUTHORIZATION_FAIL_API_PATH.replace(/%d/, serviceId);
