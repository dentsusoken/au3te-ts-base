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
  internalServerErrorError,
  badRequestError,
  unauthorizedError,
  forbiddenError,
} from '../responseErrorFactory';
import { Headers } from '../../utils/responseFactory';

/**
 * Options required for validating credential single parse responses.
 */
export type ValidateCredentialSingleParseResponseOptions = {
  /** HTTP headers to be included in the response */
  headers: Headers;
  /** Access token used for authentication */
  accessToken: string;
};

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
    ValidateCredentialSingleParseResponseOptions
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
  async (
    apiResponse: CredentialSingleParseResponse,
    options?: ValidateCredentialSingleParseResponseOptions
  ) => {
    if (!options) {
      throw internalServerErrorError('Options are required');
    }

    const { headers, accessToken } = options;
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'BAD_REQUEST':
        throw badRequestError(responseContent!, headers);
      case 'UNAUTHORIZED':
        throw unauthorizedError(
          accessToken,
          responseContent ?? undefined,
          headers
        );
      case 'FORBIDDEN':
        throw forbiddenError(responseContent!, headers);
      case 'OK':
        return;
      case 'INTERNAL_SERVER_ERROR':
        throw internalServerErrorError(responseContent!, headers);
      default:
        throw internalServerErrorError(
          buildUnknownActionMessage(path, action),
          headers
        );
    }
  };
