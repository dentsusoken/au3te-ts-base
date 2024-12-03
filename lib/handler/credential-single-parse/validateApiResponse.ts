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

import { CredentialSingleParseResponse } from 'au3te-ts-common/schemas.credential-single-parse';
import {
  CreateValidateApiResponseParams,
  ValidateApiResponse,
} from '../validateApiResponse';
import {
  internalServerErrorResponseError,
  badRequestResponseError,
  unauthorizedResponseError,
  forbiddenResponseError,
} from '../responseErrorFactory';
import { CredentialApiOptions } from '../credential/types';

/**
 * Creates a validation function for credential single parse endpoint responses.
 *
 * @param params - Configuration parameters for the validation function
 * @param params.path - API endpoint path used in error messages
 * @param params.buildUnknownActionMessage - Function to create error messages for unknown actions
 * @returns A validation function for credential single parse responses
 */
export const createValidateApiResponse =
  ({
    path,
    buildUnknownActionMessage,
  }: CreateValidateApiResponseParams): ValidateApiResponse<
    CredentialSingleParseResponse,
    CredentialApiOptions
  > =>
  /**
   * Validates a credential single parse response and handles various response actions.
   *
   * @param apiResponse - Response from the Authlete credential single parse endpoint
   * @param apiResponse.action - Response action indicating the result status
   * @param apiResponse.responseContent - Optional message to include in error responses
   * @param options - Validation options containing headers and access token
   * @throws {BadRequestError} For invalid requests (action: 'BAD_REQUEST')
   * @throws {UnauthorizedError} For authentication failures (action: 'UNAUTHORIZED')
   * @throws {ForbiddenError} For permission issues (action: 'FORBIDDEN')
   * @throws {InternalServerError} For server errors or unknown actions
   */
  async (apiResponse, options) => {
    if (!options) {
      throw internalServerErrorResponseError('Options are required');
    }

    const { headers, accessToken } = options;
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'BAD_REQUEST':
        throw badRequestResponseError(responseContent!, headers);
      case 'UNAUTHORIZED':
        throw unauthorizedResponseError(
          accessToken,
          responseContent ?? undefined,
          headers
        );
      case 'FORBIDDEN':
        throw forbiddenResponseError(responseContent!, headers);
      case 'OK':
        return;
      case 'INTERNAL_SERVER_ERROR':
        throw internalServerErrorResponseError(responseContent!, headers);
      default:
        throw internalServerErrorResponseError(
          buildUnknownActionMessage(path, action),
          headers
        );
    }
  };
