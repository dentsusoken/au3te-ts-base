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

import { TokenIssueResponse } from '@vecrea/au3te-ts-common/schemas.token-issue';
import {
  CreateProcessApiResponseParams,
  ProcessApiResponse,
} from '../processApiResponse';
import * as responseFactory from '../../utils/responseFactory';

/**
 * Creates a ProcessApiResponse function that processes token issue API responses.
 *
 * @function createProcessApiResponse
 * @param {CreateProcessApiResponseParams} params - Parameters for creating the process function
 * @param {string} params.path - API endpoint path
 * @param {Function} params.buildUnknownActionMessage - Function that builds message for unknown actions
 * @returns {ProcessApiResponse<TokenIssueResponse, responseFactory.Headers>} Function that processes API responses and returns HTTP responses with optional headers
 */
export const createProcessApiResponse =
  ({
    path,
    buildUnknownActionMessage,
  }: CreateProcessApiResponseParams): ProcessApiResponse<
    TokenIssueResponse,
    responseFactory.Headers
  > =>
  async (apiResponse, headers) => {
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'OK':
        return responseFactory.ok(responseContent, headers);
      case 'INTERNAL_SERVER_ERROR':
        return responseFactory.internalServerError(responseContent, headers);
      default:
        return responseFactory.internalServerError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
