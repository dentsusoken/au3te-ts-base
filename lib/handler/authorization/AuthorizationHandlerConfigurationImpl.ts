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
  AuthorizationRequest,
  AuthorizationResponse,
  authorizationResponseSchema,
} from '@vecrea/au3te-ts-common/schemas.authorization';
import {
  ProcessApiRequest,
  createProcessApiRequest,
} from '../core/processApiRequest';
import { ProcessApiResponse } from '../core/processApiResponse';
import { createHandle, Handle } from '../core/handle';
import { SessionSchemas } from '../../session/types';
import {
  createGenerateAuthorizationPage,
  GenerateAuthorizationPage,
} from './generateAuthorizationPage';
import {
  createHandleNoInteraction,
  HandleNoInteraction,
} from './handleNoInteraction';
import {
  defaultResponseToDecisionParams,
  ResponseToDecisionParams,
} from './responseToDecisionParams';
import {
  ClearCurrentUserInfoInSessionIfNecessary,
  createClearCurrentUserInfoInSessionIfNecessary,
} from './clearCurrentUserInfoInSessionIfNecessary';
import { BuildResponse, simpleBuildResponse } from './buildResponse';
import { CheckPrompts, defaultCheckPrompts } from './checkPrompts';
import { CheckAuthAge, defaultCheckAuthAge } from './checkAuthAge';
import {
  ClearCurrentUserInfoInSession,
  defaultClearCurrentUserInfoInSession,
} from './clearCurrentUserInfoInSession';
import { CheckSubject, defaultCheckSubject } from './checkSubject';
import { CalcSub, defaultCalcSub } from './calcSub';
import { createProcessApiResponse } from './processApiResponse';
import { AuthorizationHandlerConfiguration } from './AuthorizationHandlerConfiguration';
import { AuthorizationIssueHandlerConfiguration } from '../authorization-issue/AuthorizationIssueHandlerConfiguration';
import { AuthorizationFailHandlerConfiguration } from '../authorization-fail/AuthorizationFailHandlerConfiguration';
import { AuthorizationPageHandlerConfiguration } from '@vecrea/au3te-ts-common/handler.authorization-page';
import { ServerHandlerConfiguration } from '../core/ServerHandlerConfiguration';
import { ToApiRequest } from '../core/toApiRequest';
import { ProcessRequest } from '../core/processRequest';
import { createToApiRequest } from './toApiRequest';
import { createProcessRequest } from '../core/processRequest';
import { ExtractorConfiguration } from '../../extractor/ExtractorConfiguration';
import { sessionSchemas } from '../../session/sessionSchemas';

/**
 * Parameters for constructing AuthorizationHandlerConfigurationImpl.
 * @template SS - The type of session schemas, extending SessionSchemas.
 */
type AuthorizationHandlerConfigurationImplConstructorParams<
  SS extends SessionSchemas
> = {
  /** Server handler configuration */
  serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  /** Authorization issue handler configuration */
  authorizationIssueHandlerConfiguration: AuthorizationIssueHandlerConfiguration;
  /** Authorization fail handler configuration */
  authorizationFailHandlerConfiguration: AuthorizationFailHandlerConfiguration;
  /** Authorization page handler configuration */
  authorizationPageHandlerConfiguration: AuthorizationPageHandlerConfiguration;
  /** Extractor configuration */
  extractorConfiguration: ExtractorConfiguration;
};

/** The path for the authorization endpoint */
export const AUTHORIZATION_PATH = '/api/authorization';

/**
 * Implementation of the AuthorizationHandlerConfiguration interface.
 * @template SS - The type of session schemas, extending SessionSchemas.
 * @implements {AuthorizationHandlerConfiguration<SS>}
 */
export class AuthorizationHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements AuthorizationHandlerConfiguration<SS>
{
  /** The path for the authorization endpoint */
  path = AUTHORIZATION_PATH;

  /** Function to process the API request for authorization */
  processApiRequest: ProcessApiRequest<
    AuthorizationRequest,
    AuthorizationResponse
  >;

  /** Parameters for response to decision */
  responseToDecisionParams: ResponseToDecisionParams;

  /** Function to check prompts */
  checkPrompts: CheckPrompts;

  /** Function to check authentication age */
  checkAuthAge: CheckAuthAge;

  /** Function to clear current user info in session */
  clearCurrentUserInfoInSession: ClearCurrentUserInfoInSession<SS>;

  /** Function to clear current user info in session if necessary */
  clearCurrentUserInfoInSessionIfNecessary: ClearCurrentUserInfoInSessionIfNecessary<SS>;

  /** Function to build a response */
  buildResponse: BuildResponse;

  /** Function to generate the authorization page */
  generateAuthorizationPage: GenerateAuthorizationPage<SS>;

  /** Function to check the subject */
  checkSubject: CheckSubject;

  /** Function to calculate the subject */
  calcSub: CalcSub;

  /** Function to handle no interaction cases */
  handleNoInteraction: HandleNoInteraction<SS>;

  /** Function to process the API response for authorization */
  processApiResponse: ProcessApiResponse<AuthorizationResponse>;

  /** Function to handle the authorization request */
  handle: Handle<AuthorizationRequest>;

  /** Function to convert HTTP requests to API requests */
  toApiRequest: ToApiRequest<AuthorizationRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates an instance of AuthorizationHandlerConfigurationImpl.
   * @param {AuthorizationHandlerConfigurationImplConstructorParams<SS>} params - The parameters for constructing the instance.
   */
  constructor({
    serverHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
    authorizationPageHandlerConfiguration,
    extractorConfiguration,
  }: AuthorizationHandlerConfigurationImplConstructorParams<SS>) {
    const {
      apiClient,
      session,
      buildUnknownActionMessage,
      recoverResponseResult,
      responseFactory,
      responseErrorFactory,
    } = serverHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.authorizationPath,
      authorizationResponseSchema,
      apiClient
    );

    this.responseToDecisionParams = defaultResponseToDecisionParams;

    this.checkPrompts = defaultCheckPrompts;

    this.checkAuthAge = defaultCheckAuthAge;

    this.clearCurrentUserInfoInSession =
      defaultClearCurrentUserInfoInSession as unknown as ClearCurrentUserInfoInSession<SS>;

    this.clearCurrentUserInfoInSessionIfNecessary =
      createClearCurrentUserInfoInSessionIfNecessary({
        checkPrompts: this.checkPrompts,
        checkAuthAge: this.checkAuthAge,
        clearCurrentUserInfoInSession: this.clearCurrentUserInfoInSession,
      });

    this.buildResponse = simpleBuildResponse;

    this.generateAuthorizationPage = createGenerateAuthorizationPage({
      responseToDecisionParams: this.responseToDecisionParams,
      buildAuthorizationPageModel:
        authorizationPageHandlerConfiguration.buildAuthorizationPageModel,
      clearCurrentUserInfoInSessionIfNecessary:
        this.clearCurrentUserInfoInSessionIfNecessary,
      buildResponse: this.buildResponse,
    });

    this.checkSubject = defaultCheckSubject;

    this.calcSub = defaultCalcSub;

    this.handleNoInteraction = createHandleNoInteraction({
      checkAuthAge: this.checkAuthAge,
      checkSubject: this.checkSubject,
      calcSub: this.calcSub,
      buildAuthorizationFailError:
        authorizationFailHandlerConfiguration.buildAuthorizationFailError,
      handle4AuthorizationIssue: authorizationIssueHandlerConfiguration.handle,
    });

    this.processApiResponse = createProcessApiResponse({
      session,
      path: this.path,
      generateAuthorizationPage: this.generateAuthorizationPage,
      handleNoInteraction: this.handleNoInteraction,
      buildUnknownActionMessage,
      responseFactory,
      responseErrorFactory,
    });

    this.handle = createHandle({
      path: this.path,
      processApiRequest: this.processApiRequest,
      processApiResponse: this.processApiResponse,
      recoverResponseResult,
    });

    this.toApiRequest = createToApiRequest({
      extractParameters: extractorConfiguration.extractParameters,
    });

    this.processRequest = createProcessRequest({
      path: this.path,
      toApiRequest: this.toApiRequest,
      handle: this.handle,
      recoverResponseResult,
    });
  }
}
