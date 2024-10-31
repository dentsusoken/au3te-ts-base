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

import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';
import { ProcessApiResponse } from '../processApiResponse';
import * as responseFactory from '../../utils/responseFactory';
import { GenerateAuthorizationPage } from './generateAuthorizationPage';
import { HandleNoInteraction } from './handleNoInteraction';
import { CreateProcessApiResponseParams } from '../processApiResponse';
import { Session } from '../../session/Session';
import { SessionSchemas } from '../../session/types';

/**
 * Extended parameters for creating a process API response function for authorization.
 * @template SS - The type of SessionSchemas
 */
type CreateProcessApiResponseParams4Authorization<SS extends SessionSchemas> = {
  /** The session object */
  session: Session<SS>;
  /** Function to generate the authorization page */
  generateAuthorizationPage: GenerateAuthorizationPage<SS>;
  /** Function to handle no interaction cases */
  handleNoInteraction: HandleNoInteraction<SS>;
} & CreateProcessApiResponseParams;

/**
 * Creates a function to process API responses for Authorization requests.
 * @template SS - The type of SessionSchemas
 * @param {CreateProcessApiResponseParams4Authorization<SS>} params - The parameters for creating the process function
 * @returns {ProcessApiResponse<AuthorizationResponse>} A function that processes Authorization API responses
 */
export const createProcessApiResponse =
  <SS extends SessionSchemas>({
    path,
    session,
    generateAuthorizationPage,
    handleNoInteraction,
    buildUnknownActionMessage,
  }: CreateProcessApiResponseParams4Authorization<SS>): ProcessApiResponse<AuthorizationResponse> =>
  /**
   * Processes the API response for Authorization requests.
   * @param {AuthorizationResponse} apiResponse - The response from the Authlete API for Authorization
   * @returns {Promise<Response>} A promise that resolves to the HTTP response
   */
  async (apiResponse: AuthorizationResponse): Promise<Response> => {
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
      case 'INTERACTION':
        return await generateAuthorizationPage(apiResponse, session);
      case 'NO_INTERACTION':
        return await handleNoInteraction(apiResponse, session);
      default:
        return responseFactory.internalServerError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
