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

import { CredentialIssuerMetadataResponse } from 'au3te-ts-common/schemas.credential-metadata';
import {
  CreateProcessApiResponseParams,
  ProcessApiResponse,
} from '../processApiResponse';
import * as responseFactory from '../../utils/responseFactory';

/**
 * Creates a ProcessApiResponse function that handles different API response actions.
 *
 * @function createProcessApiResponse
 * @param {CreateProcessApiResponseParams} params - The parameters for creating the process function.
 * @param {string} params.path - The path of the API endpoint.
 * @param {Function} params.buildUnknownActionMessage - Function to build an unknown action message.
 * @returns {ProcessApiResponse} A function that processes API responses and returns appropriate HTTP responses.
 */
export const createProcessApiResponse =
  ({
    path,
    buildUnknownActionMessage,
  }: CreateProcessApiResponseParams): ProcessApiResponse<CredentialIssuerMetadataResponse> =>
  /**
   * Processes the API response for Credential Issuer Metadata requests.
   *
   * @param {CredentialIssuerMetadataResponse} apiResponse - The response from the Authlete API.
   * @returns {Promise<Response>} A promise that resolves to the HTTP response.
   */
  async (apiResponse: CredentialIssuerMetadataResponse): Promise<Response> => {
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'OK':
        return responseFactory.ok(responseContent);
      case 'NOT_FOUND':
        return responseFactory.notFound(responseContent);
      case 'INTERNAL_SERVER_ERROR':
        return responseFactory.internalServerError(responseContent);
      default:
        return responseFactory.internalServerError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
