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

import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';
import {
  ProcessApiResponse,
  CreateProcessApiResponseParams,
} from '../processApiResponse';
import { PrepareHeaders } from '../prepareHeaders';
import { HandlePassword } from './handlePassword';
import { HandleTokenCreate } from './handleTokenCreate';

/**
 * The WWW-Authenticate challenge value for Basic authentication.
 * Used in authentication error responses to indicate that Basic auth is required.
 */
const CHALLENGE = 'Basic realm="token"';

/**
 * Parameters for creating a token API response processor.
 *
 * @interface TokenCreateProcessApiResponseParams
 * @extends {CreateProcessApiResponseParams}
 * @property {PrepareHeaders} prepareHeaders - Function to prepare response headers.
 *   Must handle the required dpopNonce parameter from the API response.
 * @property {HandlePassword} handlePassword - Function to handle Resource Owner Password Credentials flow.
 * @property {HandleTokenCreate} handleTokenExchange - Function to handle Token Exchange requests (RFC 8693).
 * @property {HandleTokenCreate} handleJwtBearer - Function to handle JWT Bearer Token requests (RFC 7523).
 */
type TokenCreateProcessApiResponseParams = {
  prepareHeaders: PrepareHeaders;
  handlePassword: HandlePassword;
  handleTokenExchange: HandleTokenCreate;
  handleJwtBearer: HandleTokenCreate;
} & CreateProcessApiResponseParams;

/**
 * Creates a function to process API responses for Token requests.
 *
 * @function createProcessApiResponse
 * @param {TokenCreateProcessApiResponseParams} params - Configuration parameters for the processor.
 * @returns {ProcessApiResponse<TokenResponse>} A function that processes Token API responses.
 */
export const createProcessApiResponse =
  ({
    path,
    buildUnknownActionMessage,
    responseFactory,
    responseErrorFactory,
    prepareHeaders,
    handlePassword,
    handleTokenExchange,
    handleJwtBearer,
  }: TokenCreateProcessApiResponseParams): ProcessApiResponse<TokenResponse> =>
  /**
   * Processes the API response for Token requests.
   *
   * @function
   * @param {TokenResponse} apiResponse - The response from the Authlete API.
   * @param {string} apiResponse.action - The action to be taken based on the API response.
   * @param {string} apiResponse.responseContent - The content to be included in the response.
   * @param {string} [apiResponse.dpopNonce] - The DPoP nonce value for DPoP-bound access tokens.
   * @returns {Promise<Response>} The HTTP response to be sent to the client.
   *
   * @throws {Error} If the action is unknown or processing fails.
   *
   * @example
   * const response = await processApiResponse({
   *   action: 'OK',
   *   responseContent: '{"access_token": "..."}',
   *   dpopNonce: 'nonce123'
   * });
   */
  async (apiResponse: TokenResponse): Promise<Response> => {
    const { action, responseContent } = apiResponse;
    const headers = prepareHeaders({
      dpopNonce: apiResponse.dpopNonce ?? undefined,
    });

    switch (action) {
      case 'OK':
      case 'ID_TOKEN_REISSUABLE':
        return responseFactory.ok(responseContent, headers);
      case 'BAD_REQUEST':
        throw responseErrorFactory.badRequestResponseError(
          responseContent,
          headers
        );
      case 'INVALID_CLIENT':
        throw responseErrorFactory.unauthorizedResponseError(
          responseContent,
          CHALLENGE,
          headers
        );
      case 'INTERNAL_SERVER_ERROR':
        throw responseErrorFactory.internalServerErrorResponseError(
          responseContent,
          headers
        );
      case 'PASSWORD':
        // Handle Resource Owner Password Credentials flow
        return handlePassword(apiResponse, headers);
      case 'TOKEN_EXCHANGE':
        // Handle token exchange request (RFC 8693)
        return handleTokenExchange(apiResponse, headers);
      case 'JWT_BEARER':
        // Handle JWT Bearer token request (RFC 7523)
        return handleJwtBearer(apiResponse, headers);
      default:
        throw responseErrorFactory.internalServerErrorResponseError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
