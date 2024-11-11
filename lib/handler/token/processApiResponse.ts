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

import { TokenResponse } from 'au3te-ts-common/schemas.token';
import {
  ProcessApiResponse,
  CreateProcessApiResponseParams,
} from '../processApiResponse';
import * as responseFactory from '../../utils/responseFactory';
import { PrepareHeaders } from '../prepareHeaders';

/**
 * Parameters for creating a token API response processor.
 *
 * @typedef {Object} TokenCreateProcessApiResponseParams
 * @property {PrepareHeaders} prepareHeaders - Function to prepare response headers.
 *   Must handle the required dpopNonce parameter from the API response.
 * @extends {CreateProcessApiResponseParams}
 */
type TokenCreateProcessApiResponseParams = {
  prepareHeaders: PrepareHeaders;
} & CreateProcessApiResponseParams;

/**
 * Creates a function to process API responses for Token requests.
 *
 * @param {TokenCreateProcessApiResponseParams} params - The parameters for creating the process function.
 * @returns {ProcessApiResponse<TokenResponse>} A function that processes Token API responses.
 */
export const createProcessApiResponse =
  ({
    path,
    buildUnknownActionMessage,
    prepareHeaders,
  }: TokenCreateProcessApiResponseParams): ProcessApiResponse<TokenResponse> =>
  /**
   * Processes the API response for Token requests.
   *
   * @param {TokenResponse} apiResponse - The response from the Authlete API for Token endpoint.
   *   The apiResponse object must contain:
   *   - action: The action to be taken
   *   - responseContent: The content to be included in the response
   *   - dpopNonce: The DPoP nonce value (optional)
   *   Other optional properties may be included as defined in TokenResponse
   * @returns {Promise<Response>} A promise that resolves to the HTTP response.
   */
  async (apiResponse: TokenResponse): Promise<Response> => {
    const { action, responseContent } = apiResponse;
    const headers = prepareHeaders({ dpopNonce: apiResponse.dpopNonce });

    switch (action) {
      case 'OK':
        return responseFactory.ok(responseContent, headers);
      case 'BAD_REQUEST':
        return responseFactory.badRequest(responseContent, headers);
      case 'INVALID_CLIENT':
        return responseFactory.unauthorized(
          responseContent,
          undefined,
          headers
        );
      case 'INTERNAL_SERVER_ERROR':
        return responseFactory.internalServerError(responseContent, headers);
      case 'PASSWORD':
        // Handle Resource Owner Password Credentials flow
        return responseFactory.ok(responseContent, headers);
      case 'TOKEN_EXCHANGE':
        // Handle token exchange request (RFC 8693)
        return responseFactory.ok(responseContent, headers);
      case 'JWT_BEARER':
        // Handle JWT Bearer token request (RFC 7523)
        return responseFactory.ok(responseContent, headers);
      case 'ID_TOKEN_REISSUABLE':
        // Handle ID token reissuance in refresh token flow
        return responseFactory.ok(responseContent, headers);
      default:
        return responseFactory.internalServerError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
