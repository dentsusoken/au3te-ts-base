/*
 * Copyright (C) 2014-2024 Authlete, Inc.
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

import { parseBasicCredentials } from 'au3te-ts-common/utils';

/**
 * Type representing client credentials.
 *
 * @typedef {Object} ClientCredentials
 * @property {string | undefined} clientId - The client ID.
 * @property {string | undefined} clientSecret - The client secret.
 */
export type ClientCredentials = {
  clientId: string | undefined;
  clientSecret: string | undefined;
};

/**
 * Represents a function that extracts client credentials from a Request object.
 *
 * @typedef {Function} ExtractClientCredentials
 * @async
 *
 * @param {Request} request - The Request object from which to extract client credentials.
 *
 * @returns {Promise<ClientCredentials>} A promise that resolves to a ClientCredentials object.
 *
 * @description
 * This type defines a function that takes a Request object and returns a Promise resolving to a ClientCredentials object.
 * The function is expected to extract client credentials, typically from the Authorization header of the request.
 */
export type ExtractClientCredentials = (
  request: Request
) => Promise<ClientCredentials>;

/**
 * Extracts client credentials from the Authorization header of a Request object.
 *
 * @function defaultExtractClientCredentials
 * @type {ExtractClientCredentials}
 * @async
 *
 * @param {Request} request - The Request object from which to extract client credentials.
 *
 * @returns {Promise<ClientCredentials>} A promise that resolves to a ClientCredentials object.
 *
 * @description
 * This function extracts client credentials from the Authorization header of the provided Request object.
 * It uses the parseBasicCredentials function to parse the Basic Authentication credentials.
 * If the Authorization header is missing or invalid, the function will return undefined for both clientId and clientSecret.
 *
 * @example
 * const request = new Request('https://example.com', {
 *   headers: {
 *     'Authorization': 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
 *   }
 * });
 * const credentials = await defaultExtractClientCredentials(request);
 * // credentials will be { clientId: 'username', clientSecret: 'password' }
 */
export const defaultExtractClientCredentials = async (
  request: Request
): Promise<ClientCredentials> => {
  const auth = request.headers.get('Authorization') || undefined;
  const { userId, password } = parseBasicCredentials(auth);
  const credentials: ClientCredentials = {
    clientId: userId,
    clientSecret: password,
  };

  return credentials;
};
