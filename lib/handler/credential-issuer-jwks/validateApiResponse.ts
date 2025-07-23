/*
 * Copyright (C) 201-2024 Authlete, Inc.
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

import { CredentialIssuerJwksResponse } from '@vecrea/au3te-ts-common/schemas.credential-issuer-jwks';
import {
  CreateValidateApiResponseParams,
  ValidateApiResponse,
} from '../validateApiResponse';

/**
 * Creates a ValidateApiResponse function that handles different API response actions.
 *
 * @function createValidateApiResponse
 * @param {CreateValidateApiResponseParams} params - The parameters for creating the validate function.
 * @param {string} params.path - The path of the API endpoint.
 * @param {Function} params.buildUnknownActionMessage - Function to build an unknown action message.
 * @param {Object} params.responseErrorFactory - Factory for creating error responses.
 * @returns {ValidateApiResponse} A function that validates API responses.
 */
export const createValidateApiResponse =
  ({
    path,
    buildUnknownActionMessage,
    responseErrorFactory,
  }: CreateValidateApiResponseParams): ValidateApiResponse<CredentialIssuerJwksResponse> =>
  /**
   * Validates the API response for Credential Issuer JWKS requests.
   *
   * @param {CredentialIssuerJwksResponse} apiResponse - The response from the Authlete API.
   * @returns {Promise<void>} A promise that resolves with no value if validation succeeds.
   */
  async (apiResponse: CredentialIssuerJwksResponse) => {
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'OK':
        return;
      case 'NOT_FOUND':
        throw responseErrorFactory.notFoundResponseError(responseContent!);
      case 'INTERNAL_SERVER_ERROR':
        throw responseErrorFactory.internalServerErrorResponseError(
          responseContent!
        );
      default:
        throw responseErrorFactory.internalServerErrorResponseError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
