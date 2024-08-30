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
 * The base path for the authorization API.
 * @type {string}
 */
const AUTH_AUTHORIZATION_API_PATH = '/api/%d/auth/authorization';

/**
 * The base path for the authorization fail API.
 * @type {string}
 */
const AUTH_AUTHORIZATION_FAIL_API_PATH = '/api/%d/auth/authorization/fail';

/**
 * The base path for the pushed authentication request API.
 * @type {string}
 */
const PUSHED_AUTH_REQ_API_PATH = '/api/%d/pushed_auth_req';

/**
 * The base path for the authorization issue API.
 * @type {string}
 */
const AUTH_AUTHORIZATION_ISSUE_API_PATH = '/api/%d/auth/authorization/issue';

/**
 * The base path for the token API.
 * @type {string}
 */
const AUTH_TOKEN_API_PATH = '/api/%d/auth/token';

/**
 * The base path for the introspection API.
 * @type {string}
 */
const AUTH_INTROSPECTION_API_PATH = '/api/%d/auth/introspection';

/**
 * The base path for the VCI single parse API.
 * @type {string}
 */
const VCI_SINGLE_PARSE_API_PATH = '/api/%d/vci/single/parse';

/**
 * The base path for the VCI single issue API.
 * @type {string}
 */
const VCI_SINGLE_ISSUE_API_PATH = '/api/%d/vci/single/issue';

/**
 * The base path for the service configuration API.
 * @type {string}
 */
const SERVICE_CONFIGURATION_API_PATH = '/api/%d/service/configuration';

/**
 * The base path for the VCI metadata API.
 * @type {string}
 */
const VCI_METADATA_API_PATH = '/api/%d/vci/metadata';

/**
 * Generates the path for the authorization API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const authAuthorizationPath = (serviceId: string) =>
  AUTH_AUTHORIZATION_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the path for the authorization fail API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const authAuthorizationFailPath = (serviceId: string) =>
  AUTH_AUTHORIZATION_FAIL_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the path for the pushed authentication request API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const pushedAuthReqPath = (serviceId: string) =>
  PUSHED_AUTH_REQ_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the path for the authorization issue API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const authAuthorizationIssuePath = (serviceId: string) =>
  AUTH_AUTHORIZATION_ISSUE_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the path for the token API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const authTokenPath = (serviceId: string) =>
  AUTH_TOKEN_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the path for the introspection API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const authIntrospectionPath = (serviceId: string) =>
  AUTH_INTROSPECTION_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the path for the VCI single parse API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const vciSingleParsePath = (serviceId: string) =>
  VCI_SINGLE_PARSE_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the path for the VCI single issue API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const vciSingleIssuePath = (serviceId: string) =>
  VCI_SINGLE_ISSUE_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the path for the service configuration API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const serviceConfigurationPath = (serviceId: string) =>
  SERVICE_CONFIGURATION_API_PATH.replace(/%d/, serviceId);

/**
 * Generates the path for the VCI metadata API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const vciMetadataPath = (serviceId: string) =>
  VCI_METADATA_API_PATH.replace(/%d/, serviceId);
