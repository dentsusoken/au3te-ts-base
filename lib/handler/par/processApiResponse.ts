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

import { PushedAuthReqResponse } from '@vecrea/au3te-ts-common/schemas.par';
import {
  ProcessApiResponse,
  CreateProcessApiResponseParams,
} from '../processApiResponse';
import * as responseFactory from '../../utils/responseFactory';
import { PrepareHeaders } from '../prepareHeaders';

/**
 * Parameters for creating a PAR API response processor.
 *
 * @typedef {Object} ParCreateProcessApiResponseParams
 * @property {PrepareHeaders} prepareHeaders - Function to prepare response headers.
 *   Must handle the required dpopNonce parameter from the API response.
 */
type ParCreateProcessApiResponseParams = CreateProcessApiResponseParams & {
  prepareHeaders: PrepareHeaders;
};

/**
 * Creates a function to process API responses for Pushed Authorization Requests (PAR).
 *
 * @param {ParCreateProcessApiResponseParams} params - The parameters for creating the process function.
 * @returns {ProcessApiResponse<PushedAuthReqResponse>} A function that processes PAR API responses.
 */
export const createProcessApiResponse =
  ({
    path,
    buildUnknownActionMessage,
    prepareHeaders,
  }: ParCreateProcessApiResponseParams): ProcessApiResponse<PushedAuthReqResponse> =>
  async (apiResponse: PushedAuthReqResponse): Promise<Response> => {
    const { action, responseContent } = apiResponse;
    const headers = prepareHeaders({
      dpopNonce: apiResponse.dpopNonce ?? undefined,
    });

    switch (action) {
      case 'CREATED':
        return responseFactory.created(responseContent, headers);
      case 'BAD_REQUEST':
        return responseFactory.badRequest(responseContent, headers);
      case 'UNAUTHORIZED':
        return responseFactory.unauthorized(
          responseContent,
          undefined,
          headers
        );
      case 'FORBIDDEN':
        return responseFactory.forbidden(responseContent, headers);
      case 'PAYLOAD_TOO_LARGE':
        return responseFactory.tooLarge(responseContent, headers);
      case 'INTERNAL_SERVER_ERROR':
        return responseFactory.internalServerError(responseContent, headers);
      default:
        return responseFactory.internalServerError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
