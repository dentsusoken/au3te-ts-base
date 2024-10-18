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
import { ProcessApiResponse } from '../processApiResponse';
import * as responseFactory from '../../utils/responseFactory';
import { BuildUnknownActionMessage } from 'au3te-ts-common/handler';

/**
 * Creates a ProcessApiResponse function that handles different API response actions.
 *
 * @function createProcessApiResponse
 * @param {BuildUnknownActionMessage} buildUnknownActionMessage - A function to build an error message for unknown actions.
 * @returns {ProcessApiResponse} A function that processes API responses and returns appropriate HTTP responses.
 */
export const createProcessApiResponse =
  (
    buildUnknownActionMessage: BuildUnknownActionMessage
  ): ProcessApiResponse<CredentialIssuerMetadataResponse> =>
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
          buildUnknownActionMessage(action)
        );
    }
  };
