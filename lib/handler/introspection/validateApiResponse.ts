/*
 * Copyright (C) 20142024 Authlete, Inc.
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

import { IntrospectionResponse } from '@vecrea/au3te-ts-common/schemas.introspection';
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
import { PrepareHeaders } from '../prepareHeaders';

type CreateValidateApiResponseParams4Introspection = {
  prepareHeaders: PrepareHeaders;
} & CreateValidateApiResponseParams;

/**
 * Creates a ValidateApiResponse function specifically for introspection endpoint responses.
 *
 * @function createValidateApiResponse
 * @param {CreateValidateApiResponseParams4Introspection} params - Configuration parameters
 * @param {string} params.path - The API endpoint path to be used in error messages
 * @param {Function} params.buildUnknownActionMessage - Function to generate error message for unknown actions
 * @param {PrepareHeaders} params.prepareHeaders - Function to prepare HTTP headers for the response
 * @returns {ValidateApiResponse<IntrospectionResponse>} A validation function that processes introspection responses
 * @throws {Error} Various HTTP errors depending on the action in the response
 */
export const createValidateApiResponse =
  ({
    path,
    buildUnknownActionMessage,
    prepareHeaders,
  }: CreateValidateApiResponseParams4Introspection): ValidateApiResponse<IntrospectionResponse> =>
  /**
   * Validates an introspection response from the Authlete API and handles different response actions.
   *
   * @param {IntrospectionResponse} apiResponse - The response received from Authlete's introspection endpoint
   * @param {string} apiResponse.action - The action to take (e.g., 'OK', 'BAD_REQUEST', etc.)
   * @param {string} [apiResponse.responseContent] - Optional response content to include in error messages
   * @param {string} [apiResponse.dpopNonce] - Optional DPoP nonce for header preparation
   * @returns {Promise<void>} Resolves if validation succeeds, throws an error otherwise
   * @throws {BadRequestError} When the action is 'BAD_REQUEST'
   * @throws {UnauthorizedError} When the action is 'UNAUTHORIZED'
   * @throws {ForbiddenError} When the action is 'FORBIDDEN'
   * @throws {InternalServerError} When the action is 'INTERNAL_SERVER_ERROR' or unknown
   */
  async (apiResponse: IntrospectionResponse) => {
    const { action, responseContent, dpopNonce } = apiResponse;
    const headers = prepareHeaders({ dpopNonce: dpopNonce || undefined });

    switch (action) {
      case 'INTERNAL_SERVER_ERROR':
        throw internalServerErrorResponseError(responseContent!, headers);
      case 'BAD_REQUEST':
        throw badRequestResponseError(responseContent!, headers);
      case 'UNAUTHORIZED':
        throw unauthorizedResponseError(responseContent!, undefined, headers);
      case 'FORBIDDEN':
        throw forbiddenResponseError(responseContent!, headers);
      case 'OK':
        return;
      default:
        throw internalServerErrorResponseError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
