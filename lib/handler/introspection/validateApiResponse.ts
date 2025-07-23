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
import { PrepareHeaders } from '../prepareHeaders';
import {
  ValidateApiResponse,
  CreateValidateApiResponseParams,
} from '../validateApiResponse';

type CreateValidateApiResponseParams4Introspection = {
  prepareHeaders: PrepareHeaders;
} & CreateValidateApiResponseParams;

export const createValidateApiResponse =
  ({
    path,
    responseErrorFactory,
    buildUnknownActionMessage,
    prepareHeaders,
  }: CreateValidateApiResponseParams4Introspection): ValidateApiResponse<IntrospectionResponse> =>
  async (apiResponse: IntrospectionResponse) => {
    const { action, responseContent, dpopNonce } = apiResponse;
    const headers = prepareHeaders({ dpopNonce });

    switch (action) {
      case 'INTERNAL_SERVER_ERROR':
        throw responseErrorFactory.internalServerErrorResponseError(
          responseContent,
          headers
        );
      case 'BAD_REQUEST':
        throw responseErrorFactory.badRequestResponseError(
          responseContent,
          headers
        );
      case 'UNAUTHORIZED':
        throw responseErrorFactory.unauthorizedResponseError(
          responseContent,
          undefined,
          headers
        );
      case 'FORBIDDEN':
        throw responseErrorFactory.forbiddenResponseError(
          responseContent,
          headers
        );
      case 'OK':
        return;
      default:
        throw responseErrorFactory.internalServerErrorResponseError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
