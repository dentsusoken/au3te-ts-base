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

import { PushedAuthReqResponse } from 'au3te-ts-common/schemas.par';
import * as responseFactory from '../../utils/responseFactory';
import { BuildUnknownActionMessage } from 'au3te-ts-common/endpoint';

/**
 * Prepares headers for the HTTP response based on the API response.
 *
 * @function prepareHeaders
 * @param {PushedAuthReqResponse} apiResponse - The response from the Authlete API.
 * @returns {responseFactory.Headers} An object containing the prepared headers.
 */
export const prepareHeaders = (
  apiResponse: PushedAuthReqResponse
): responseFactory.Headers => {
  const { dpopNonce } = apiResponse;
  const headers = {} as responseFactory.Headers;

  if (dpopNonce) {
    headers['DPoP-Nonce'] = dpopNonce;
  }

  return headers;
};

/**
 * Represents a function that processes a PushedAuthReqResponse and returns a Promise resolving to a Response.
 *
 * @typedef {Function} ProcessApiResponse
 * @param {PushedAuthReqResponse} apiResponse - The response from the Authlete API to be processed.
 * @returns {Promise<Response>} A promise that resolves to the HTTP response.
 */
export type ProcessApiResponse = (
  apiResponse: PushedAuthReqResponse
) => Promise<Response>;

/**
 * Creates a ProcessApiResponse function that handles different API response actions.
 *
 * @function createProcessApiResponse
 * @param {BuildUnknownActionMessage} buildUnknownActionMessage - A function to build an error message for unknown actions.
 * @returns {ProcessApiResponse} A function that processes API responses and returns appropriate HTTP responses.
 */
export const createProcessApiResponse =
  (buildUnknownActionMessage: BuildUnknownActionMessage): ProcessApiResponse =>
  async (apiResponse: PushedAuthReqResponse): Promise<Response> => {
    const { action, responseContent } = apiResponse;
    const headers = prepareHeaders(apiResponse);

    switch (action) {
      case 'CREATED':
        return responseFactory.created(responseContent, headers);
      case 'BAD_REQUEST':
        return responseFactory.badRequest(responseContent, headers);
      case 'UNAUTHORIZED':
        return responseFactory.unauthorized(
          responseContent,
          undefined,
          headers
        );
      case 'FORBIDDEN':
        return responseFactory.forbidden(responseContent, headers);
      case 'PAYLOAD_TOO_LARGE':
        return responseFactory.tooLarge(responseContent, headers);
      case 'INTERNAL_SERVER_ERROR':
        return responseFactory.internalServerError(responseContent, headers);
      default:
        return responseFactory.internalServerError(
          buildUnknownActionMessage(action)
        );
    }
  };
