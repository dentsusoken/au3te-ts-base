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

const AUTH_AUTHORIZATION_API_PATH = '/api/%d/auth/authorization';

/**
 * Generates the path for the pushed authentication request API.
 * @param {string} serviceId - The service ID.
 * @returns {string} The generated path.
 */
export const pushedAuthReqPath = (serviceId: string) =>
  PUSHED_AUTH_REQ_API_PATH.replace(/%d/, serviceId);

export const authorizationPath = (serviceId: string) =>
  AUTH_AUTHORIZATION_API_PATH.replace(/%d/, serviceId);
