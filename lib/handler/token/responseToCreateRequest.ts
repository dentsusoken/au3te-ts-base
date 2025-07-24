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

import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';
import { GrantType } from '@vecrea/au3te-ts-common/schemas.common';
import { TokenCreateRequest } from '@vecrea/au3te-ts-common/schemas.token-create';
import { DetermineSubject } from './determineSubject';
import { ResponseErrorFactory } from '../core/responseErrorFactory';

/**
 * Function type for converting a token response to a token create request.
 *
 * @param apiResponse - The token response from the API
 * @returns A promise resolving to the token create request
 * @throws {BadRequestError} If the conversion fails
 */
export type ResponseToCreateRequest = (
  apiResponse: TokenResponse
) => Promise<TokenCreateRequest>;

type CreateResponseToCreateRequestParams = {
  grantType: GrantType;
  determineSubject: DetermineSubject;
  responseErrorFactory: ResponseErrorFactory;
};

export const createResponseToCreateRequest =
  ({
    grantType,
    determineSubject,
    responseErrorFactory,
  }: CreateResponseToCreateRequestParams): ResponseToCreateRequest =>
  async (apiResponse: TokenResponse) => {
    const { clientId, scopes, resources } = apiResponse;

    if (!clientId || clientId === 0) {
      throw responseErrorFactory.badRequestResponseError(
        'This authorization server does not allow unidentifiable clients to make token exchange requests.'
      );
    }

    const subject = await determineSubject(apiResponse, responseErrorFactory);

    return {
      grantType,
      clientId,
      subject,
      scopes,
      resources,
    };
  };
