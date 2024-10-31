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

import {
  AuthorizationFailRequest,
  AuthorizationFailResponse,
  authorizationFailResponseSchema,
} from 'au3te-ts-common/schemas.authorization-fail';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { AuthorizationFailHandlerConfiguration } from './AuthorizationFailHandlerConfiguration';

/**
 * Implementation of the AuthorizationFailHandlerConfiguration interface.
 * This class configures and handles Authorization Fail requests.
 */
export class AuthorizationFailHandlerConfigurationImpl
  implements AuthorizationFailHandlerConfiguration
{
  /** The path for the authorization fail endpoint. */
  path: string = '/api/auth/authorization/fail';

  /** Function to process the API request for authorization fail. */
  processApiRequest: ProcessApiRequest<
    AuthorizationFailRequest,
    AuthorizationFailResponse
  >;

  /** Function to process the API response for authorization fail. */
  processApiResponse: ProcessApiResponse<AuthorizationFailResponse>;

  /** Function to handle the authorization fail request. */
  handle: Handle<AuthorizationFailRequest>;

  /**
   * Creates an instance of AuthorizationFailHandlerConfigurationImpl.
   * @param {BaseHandlerConfiguration<SessionSchemas>} baseHandlerConfiguration - The base handler configuration.
   */
  constructor(
    baseHandlerConfiguration: BaseHandlerConfiguration<SessionSchemas>
  ) {
    const { apiClient, buildUnknownActionMessage, recoverResponseResult } =
      baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.authorizationFailPath,
      authorizationFailResponseSchema,
      apiClient
    );

    this.processApiResponse = createProcessApiResponse({
      path: this.path,
      buildUnknownActionMessage,
    });

    this.handle = createHandle({
      path: this.path,
      processApiRequest: this.processApiRequest,
      processApiResponse: this.processApiResponse,
      recoverResponseResult,
    });
  }
}