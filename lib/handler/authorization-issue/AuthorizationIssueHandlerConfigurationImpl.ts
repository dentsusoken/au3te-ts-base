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
  AuthorizationIssueRequest,
  AuthorizationIssueResponse,
  authorizationIssueResponseSchema,
} from 'au3te-ts-common/schemas.authorization-issue';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { AuthorizationIssueHandlerConfiguration } from './AuthorizationIssueHandlerConfiguration';

/**
 * Implementation of the AuthorizationIssueHandlerConfiguration interface.
 * This class configures the handling of authorization issue requests.
 */
export class AuthorizationIssueHandlerConfigurationImpl<
  SS extends SessionSchemas
> implements AuthorizationIssueHandlerConfiguration
{
  /** The path for the authorization issue endpoint. */
  path: string = '/api/authorization/issue';

  /** Function to process the API request for authorization issue. */
  processApiRequest: ProcessApiRequest<
    AuthorizationIssueRequest,
    AuthorizationIssueResponse
  >;

  /** Function to process the API response for authorization issue. */
  processApiResponse: ProcessApiResponse<AuthorizationIssueResponse>;

  /** Function to handle the authorization issue request. */
  handle: Handle<AuthorizationIssueRequest>;

  /**
   * Creates an instance of AuthorizationIssueHandlerConfigurationImpl.
   * @param {BaseHandlerConfiguration<SS>} baseHandlerConfiguration - The base handler configuration.
   */
  constructor(baseHandlerConfiguration: BaseHandlerConfiguration<SS>) {
    const { apiClient, buildUnknownActionMessage, recoverResponseResult } =
      baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.authorizationIssuePath,
      authorizationIssueResponseSchema,
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
