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

import { AuthorizationIssueRequest } from 'au3te-ts-common/schemas.authorization-issue';
import { BaseHandlerConfiguration } from '../../handler/BaseHandlerConfiguration';
import { AuthorizationIssueHandlerConfiguration } from '../../handler/authorization-issue';
import { sessionSchemas } from '../../session/sessionSchemas';
import { createProcessRequest, ProcessRequest } from '../processRequest';
import { AuthorizationDecisionEndpointConfiguration } from './AuthorizationDecisionEndpointConfiguration';
import { createToApiRequest } from './toApiRequest';
import { ToApiRequest } from '../toApiRequest';
import { ExtractorConfiguration } from '../../extractor/ExtractorConfiguration';
import { CollectClaims, defaultCollectClaims } from './collectClaims';
import {
  GetOrAuthenticateUser,
  createGetOrAuthenticateUser,
} from './getOrAuthenticateUser';
import { UserConfiguration } from 'au3te-ts-common/user';
import { AuthorizationHandlerConfiguration } from '../../handler/authorization/AuthorizationHandlerConfiguration';
import { SessionSchemas } from '../../session/types';

type CreateAuthorizationDecisionEndpointConfigurationImplConstructorParams<
  SS extends SessionSchemas
> = {
  baseHandlerConfiguration: BaseHandlerConfiguration<typeof sessionSchemas>;
  extractorConfiguration: ExtractorConfiguration;
  userConfiguration: UserConfiguration;
  authorizationHandlerConfiguration: AuthorizationHandlerConfiguration<SS>;
  authorizationIssueHandlerConfiguration: AuthorizationIssueHandlerConfiguration;
};

/**
 * Implementation of the Authorization Decision endpoint configuration.
 * Handles conversion of HTTP requests to Authorization Decision API requests and processes them.
 *
 * @implements {AuthorizationDecisionEndpointConfiguration}
 */
export class AuthorizationDecisionEndpointConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements AuthorizationDecisionEndpointConfiguration
{
  /** Function to collect claims for the user based on requested scopes and claim names */
  collectClaims: CollectClaims = defaultCollectClaims;

  /** Function to get an authenticated user or perform authentication if needed */
  getOrAuthenticateUser: GetOrAuthenticateUser;

  /** Function to convert HTTP requests to Authorization Decision API requests */
  toApiRequest: ToApiRequest<AuthorizationIssueRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates a new Authorization Decision endpoint configuration instance.
   *
   * @param params - Configuration parameters
   */
  constructor({
    baseHandlerConfiguration,
    extractorConfiguration,
    userConfiguration,
    authorizationHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
  }: CreateAuthorizationDecisionEndpointConfigurationImplConstructorParams<SS>) {
    this.getOrAuthenticateUser = createGetOrAuthenticateUser(
      userConfiguration.getByCredentials
    );

    this.toApiRequest = createToApiRequest({
      session: baseHandlerConfiguration.session,
      extractParameters: extractorConfiguration.extractParameters,
      getOrAuthenticateUser: this.getOrAuthenticateUser,
      buildAuthorizationFailError:
        authorizationHandlerConfiguration.buildAuthorizationFailError,
      calcSub: authorizationHandlerConfiguration.calcSub,
      collectClaims: this.collectClaims,
    });

    this.processRequest = createProcessRequest({
      path: authorizationIssueHandlerConfiguration.path,
      toApiRequest: this.toApiRequest,
      handle: authorizationIssueHandlerConfiguration.handle,
      recoverResponseResult: baseHandlerConfiguration.recoverResponseResult,
    });
  }
}