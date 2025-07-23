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

import { AuthorizationIssueRequest } from '@vecrea/au3te-ts-common/schemas.authorization-issue';
import { ServerHandlerConfiguration } from '../ServerHandlerConfiguration';
import { AuthorizationIssueHandlerConfiguration } from '../authorization-issue';
import { sessionSchemas } from '../../session/sessionSchemas';
import { createProcessRequest, ProcessRequest } from '../processRequest';
import { AuthorizationDecisionHandlerConfiguration } from './AuthorizationDecisionHandlerConfiguration';
import { createToApiRequest } from './toApiRequest';
import { ToApiRequest } from '../toApiRequest';
import { ExtractorConfiguration } from '../../extractor/ExtractorConfiguration';
import { CollectClaims, defaultCollectClaims } from './collectClaims';
import {
  GetOrAuthenticateUser,
  createGetOrAuthenticateUser,
} from './getOrAuthenticateUser';
import { UserHandlerConfiguration } from '@vecrea/au3te-ts-common/handler.user';
import { AuthorizationHandlerConfiguration } from '../authorization/AuthorizationHandlerConfiguration';
import { SessionSchemas } from '../../session/types';
import { AuthorizationFailHandlerConfiguration } from '../authorization-fail';

type CreateAuthorizationDecisionHandlerConfigurationImplConstructorParams<
  SS extends SessionSchemas
> = {
  serverHandlerConfiguration: ServerHandlerConfiguration<typeof sessionSchemas>;
  extractorConfiguration: ExtractorConfiguration;
  userHandlerConfiguration: UserHandlerConfiguration;
  authorizationHandlerConfiguration: AuthorizationHandlerConfiguration<SS>;
  authorizationIssueHandlerConfiguration: AuthorizationIssueHandlerConfiguration;
  authorizationFailHandlerConfiguration: AuthorizationFailHandlerConfiguration;
};

/** The path for the authorization decision endpoint */
export const AUTHORIZATION_DECISION_PATH = '/api/authorization/decision';

/**
 * Implementation of the Authorization Decision handler configuration.
 * Handles conversion of HTTP requests to Authorization Decision API requests and processes them.
 *
 * @implements {AuthorizationDecisionHandlerConfiguration}
 */
export class AuthorizationDecisionHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements AuthorizationDecisionHandlerConfiguration
{
  /** The path for the authorization decision endpoint */
  path: string = AUTHORIZATION_DECISION_PATH;

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
    serverHandlerConfiguration,
    extractorConfiguration,
    userHandlerConfiguration,
    authorizationHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
  }: CreateAuthorizationDecisionHandlerConfigurationImplConstructorParams<SS>) {
    const { recoverResponseResult, responseErrorFactory } =
      serverHandlerConfiguration;

    this.getOrAuthenticateUser = createGetOrAuthenticateUser(
      userHandlerConfiguration.getByCredentials
    );

    this.toApiRequest = createToApiRequest({
      session: serverHandlerConfiguration.session,
      extractParameters: extractorConfiguration.extractParameters,
      getOrAuthenticateUser: this.getOrAuthenticateUser,
      buildAuthorizationFailError:
        authorizationFailHandlerConfiguration.buildAuthorizationFailError,
      calcSub: authorizationHandlerConfiguration.calcSub,
      collectClaims: this.collectClaims,
      responseErrorFactory,
    });

    this.processRequest = createProcessRequest({
      path: this.path,
      toApiRequest: this.toApiRequest,
      handle: authorizationIssueHandlerConfiguration.handle,
      recoverResponseResult,
    });
  }
}
