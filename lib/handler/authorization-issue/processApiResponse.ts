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

import { AuthorizationIssueResponse } from '@vecrea/au3te-ts-common/schemas.authorization-issue';
import {
  ProcessApiResponse,
  CreateProcessApiResponseParams,
} from '../processApiResponse';

/**
 * Creates a function to process API responses for Authorization Issue requests.
 *
 * @param {CreateProcessApiResponseParams} params - The parameters for creating the process function.
 * @param {string} params.path - The path of the API endpoint.
 * @param {Function} params.buildUnknownActionMessage - Function to build an unknown action message.
 * @returns {ProcessApiResponse<AuthorizationIssueResponse>} A function that processes Authorization Issue API responses.
 */
export const createProcessApiResponse =
  ({
    path,
    buildUnknownActionMessage,
    responseFactory,
    responseErrorFactory,
  }: CreateProcessApiResponseParams): ProcessApiResponse<AuthorizationIssueResponse> =>
  /**
   * Processes the API response for Authorization Issue requests.
   *
   * @param {AuthorizationIssueResponse} apiResponse - The response from the Authlete API for Authorization Issue.
   * @returns {Promise<Response>} A promise that resolves to the HTTP response.
   */
  async (apiResponse: AuthorizationIssueResponse): Promise<Response> => {
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'INTERNAL_SERVER_ERROR':
        throw responseErrorFactory.internalServerErrorResponseError(
          responseContent
        );
      case 'BAD_REQUEST':
        throw responseErrorFactory.badRequestResponseError(responseContent);
      case 'LOCATION':
        return responseFactory.location(responseContent!);
      case 'FORM':
        return responseFactory.form(responseContent);
      default:
        throw responseErrorFactory.internalServerErrorResponseError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
