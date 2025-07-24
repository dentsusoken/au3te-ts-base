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

import { TokenFailResponse } from '@vecrea/au3te-ts-common/schemas.token-fail';
import {
  CreateProcessApiResponseParams,
  ProcessApiResponse,
} from '../core/processApiResponse';
import { Headers } from '../core/responseFactory';

export const createProcessApiResponse =
  ({
    path,
    buildUnknownActionMessage,
    responseErrorFactory,
  }: CreateProcessApiResponseParams): ProcessApiResponse<
    TokenFailResponse,
    Headers
  > =>
  async (apiResponse, headers) => {
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'BAD_REQUEST':
        throw responseErrorFactory.badRequestResponseError(
          responseContent,
          headers
        );
      case 'INTERNAL_SERVER_ERROR':
        throw responseErrorFactory.internalServerErrorResponseError(
          responseContent,
          headers
        );
      default:
        throw responseErrorFactory.internalServerErrorResponseError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
