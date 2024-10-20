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
import { BuildUnknownActionMessage } from 'au3te-ts-common/handler';
import { GenerateAuthorizationPage } from './generateAuthorizationPage';
import { HandleNoInteraction } from './handleNoInteraction';
import { BaseSession } from '../../session/BaseSession';

/**
 * Type definition for parameters required to create a ProcessApiResponse function
 * @typedef {Object} CreateProcessApiResponseParams
 * @property {BaseSession} session - The session object
 * @property {GenerateAuthorizationPage} generateAuthorizationPage - Function to generate the authorization page
 * @property {HandleNoInteraction} handleNoInteraction - Function to handle cases where no interaction is required
 * @property {BuildUnknownActionMessage} buildUnknownActionMessage - Function to build error messages for unknown actions
 */
type CreateProcessApiResponseParams = {
  session: BaseSession;
  generateAuthorizationPage: GenerateAuthorizationPage;
  handleNoInteraction: HandleNoInteraction;
  buildUnknownActionMessage: BuildUnknownActionMessage;
};

/**
 * Creates a function to process authorization API responses
 * @param {CreateProcessApiResponseParams} params - Parameters required to create the function
 * @returns {ProcessApiResponse<AuthorizationResponse>} Function to process authorization API responses
 */
export const createProcessApiResponse =
  ({
    session,
    generateAuthorizationPage,
    handleNoInteraction,
    buildUnknownActionMessage,
  }: CreateProcessApiResponseParams): ProcessApiResponse<AuthorizationResponse> =>
  /**
   * Processes the authorization API response and returns an appropriate HTTP response
   * @param {AuthorizationResponse} apiResponse - Response from the authorization API
   * @returns {Promise<Response>} HTTP response
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
          buildUnknownActionMessage(action)
        );
    }
  };
