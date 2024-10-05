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

import { AuthorizationIssueResponse } from 'au3te-ts-common/schemas.authorization.issue';
import * as responseFactory from '../../utils/responseFactory';
import { BuildUnknownActionMessage } from 'au3te-ts-common/handler';
import { ProcessApiResponse } from '../processApiResponse';

/**
 * Creates a function to process the API response from the authorization issue endpoint.
 *
 * @param {BuildUnknownActionMessage} buildUnknownActionMessage - A function to build an error message for unknown actions.
 * @returns {ProcessApiResponse<AuthorizationIssueResponse>} A function that takes an AuthorizationIssueResponse and returns a Promise resolving to a Response.
 *
 * @template AuthorizationIssueResponse
 * @template Response
 *
 * @callback ProcessApiResponse
 * @param {AuthorizationIssueResponse} apiResponse - The response from the authorization issue API.
 * @returns {Promise<Response>} A promise that resolves to the appropriate Response based on the action.
 *
 * @typedef {Object} AuthorizationIssueResponse
 * @property {string} action - The action to be taken based on the API response.
 * @property {string} [responseContent] - The content of the response, if any.
 *
 * @typedef {Function} BuildUnknownActionMessage
 * @param {string} action - The unknown action encountered.
 * @returns {string} An error message for the unknown action.
 */
export const createProcessApiResponse =
  (
    buildUnknownActionMessage: BuildUnknownActionMessage
  ): ProcessApiResponse<AuthorizationIssueResponse> =>
  async (apiResponse: AuthorizationIssueResponse): Promise<Response> => {
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'INTERNAL_SERVER_ERROR':
        return responseFactory.internalServerError(responseContent);
      case 'BAD_REQUEST':
        return responseFactory.badRequest(responseContent);
      case 'LOCATION':
        return responseFactory.location(responseContent!);
      case 'FORM':
        return responseFactory.form(responseContent);
      default:
        return responseFactory.internalServerError(
          buildUnknownActionMessage(action)
        );
    }
  };
