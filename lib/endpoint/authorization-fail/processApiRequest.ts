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

import {
  AuthorizationFailRequest,
  AuthorizationFailResponse,
} from 'au3te-ts-common/schemas.authorization.fail';
import { AuthleteApiFactory } from 'au3te-ts-common/api';

/**
 * Represents a function that processes an authorization fail request.
 *
 * @typedef {Function} ProcessApiRequest
 * @param {AuthorizationFailRequest} apiRequest - The authorization fail request to process.
 * @returns {Promise<AuthorizationFailResponse>} A promise that resolves to the authorization fail response.
 */
export type ProcessApiRequest = (
  apiRequest: AuthorizationFailRequest
) => Promise<AuthorizationFailResponse>;

/**
 * Default implementation for processing an authorization fail request.
 *
 * This function uses the default Authlete API instance to call the authorizationFail endpoint.
 *
 * @type {ProcessApiRequest}
 * @param {AuthorizationFailRequest} apiRequest - The authorization fail request to process.
 * @returns {Promise<AuthorizationFailResponse>} A promise that resolves to the authorization fail response from Authlete.
 *
 * @throws {Error} If there's an issue with the API call or if the Authlete API is not properly initialized.
 *
 * @remarks
 * This function is used to notify Authlete about a failed authorization attempt.
 * It's typically called when the authorization server encounters an error or
 * when the end-user denies the authorization request.
 *
 * The response from Authlete will contain instructions on how to proceed,
 * such as redirecting the user or showing an error message.
 *
 * @see {@link https://docs.authlete.com/#auth-authorization-fail|Authlete API Reference: /auth/authorization/fail}
 */
export const defaultProcessApiRequest: ProcessApiRequest = async (
  apiRequest: AuthorizationFailRequest
): Promise<AuthorizationFailResponse> => {
  const authleteApi = AuthleteApiFactory.getDefaultApi();

  return authleteApi.authorizationFail(apiRequest);
};
