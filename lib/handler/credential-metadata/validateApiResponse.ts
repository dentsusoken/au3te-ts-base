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

import { CredentialIssuerMetadataResponse } from '@vecrea/au3te-ts-common/schemas.credential-metadata';
import {
  CreateValidateApiResponseParams,
  ValidateApiResponse,
} from '../validateApiResponse';
import {
  notFoundResponseError,
  internalServerErrorResponseError,
} from '../responseErrorFactory';

/**
 * Creates a ValidateApiResponse function that handles different API response actions.
 *
 * @function createValidateApiResponse
 * @param {CreateValidateApiResponseParams} params - The parameters for creating the validate function.
 * @param {string} params.path - The path of the API endpoint.
 * @param {Function} params.buildUnknownActionMessage - Function to build an unknown action message.
 * @returns {ValidateApiResponse} A function that validates API responses.
 */
export const createValidateApiResponse =
  ({
    path,
    buildUnknownActionMessage,
  }: CreateValidateApiResponseParams): ValidateApiResponse<CredentialIssuerMetadataResponse> =>
  /**
   * Validates the API response for Credential Issuer Metadata requests.
   *
   * @param {CredentialIssuerMetadataResponse} apiResponse - The response from the Authlete API.
   * @returns {Promise<void>} A promise that resolves with no value if validation succeeds.
   */
  async (apiResponse: CredentialIssuerMetadataResponse) => {
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'OK':
        return;
      case 'NOT_FOUND':
        throw notFoundResponseError(responseContent!);
      case 'INTERNAL_SERVER_ERROR':
        throw internalServerErrorResponseError(responseContent!);
      default:
        throw internalServerErrorResponseError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
