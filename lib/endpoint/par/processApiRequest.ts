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
  PushedAuthReqRequest,
  PushedAuthReqResponse,
} from 'au3te-ts-common/schemas.par';
import { AuthleteApiFactory } from 'au3te-ts-common/api';

/**
 * Represents a function that processes a PushedAuthReqRequest and returns a Promise resolving to a PushedAuthReqResponse.
 *
 * @typedef {Function} ProcessApiRequest
 * @param {PushedAuthReqRequest} apiRequest - The request object to be processed.
 * @returns {Promise<PushedAuthReqResponse>} A promise that resolves to the response from the API.
 */
export type ProcessApiRequest = (
  apiRequest: PushedAuthReqRequest
) => Promise<PushedAuthReqResponse>;

/**
 * Default implementation of the ProcessApiRequest function.
 * This function sends a push authorization request to the Authlete API.
 *
 * @function defaultProcessApiRequest
 * @type {ProcessApiRequest}
 * @async
 *
 * @param {PushedAuthReqRequest} apiRequest - The request object to be sent to the Authlete API.
 * @returns {Promise<PushedAuthReqResponse>} A promise that resolves to the response from the Authlete API.
 */
export const defaultProcessApiRequest: ProcessApiRequest = async (
  apiRequest: PushedAuthReqRequest
): Promise<PushedAuthReqResponse> => {
  const authleteApi = AuthleteApiFactory.getDefaultApi();

  return authleteApi.pushAuthorizationRequest(apiRequest);
};
