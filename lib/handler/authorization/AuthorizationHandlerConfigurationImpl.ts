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
} from 'au3te-ts-common/schemas.authorization';
import {
  ProcessApiRequest,
  createProcessApiRequest,
} from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { createHandle, Handle } from '../handle';
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
import {
  BuildAuthorizationFailError,
  createBuildAuthorizationFailError,
} from './buildAuthorizationFailError';
import { AuthorizationHandlerConfiguration } from './AuthorizationHandlerConfiguration';
import { AuthorizationIssueHandlerConfiguration } from '../authorization-issue/AuthorizationIssueHandlerConfiguration';
import { AuthorizationFailHandlerConfiguration } from '../authorization-fail/AuthorizationFailHandlerConfiguration';
import { AuthorizationPageModelConfiguration } from 'au3te-ts-common/page-model.authorization';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';

type AuthorizationHandlerConfigurationImplConstructorParams<
  SS extends SessionSchemas
> = {
  baseHandlerConfiguration: BaseHandlerConfiguration<SS>;
  authorizationIssueHandlerConfiguration: AuthorizationIssueHandlerConfiguration;
  authorizationFailHandlerConfiguration: AuthorizationFailHandlerConfiguration;
  authorizationPageModelConfiguration: AuthorizationPageModelConfiguration;
};

export class AuthorizationHandlerConfigurationImpl<SS extends SessionSchemas>
  implements AuthorizationHandlerConfiguration<SS>
{
  path = '/api/auth/authorization';

  processApiRequest: ProcessApiRequest<
    AuthorizationRequest,
    AuthorizationResponse
  >;

  responseToDecisionParams: ResponseToDecisionParams;

  checkPrompts: CheckPrompts;

  checkAuthAge: CheckAuthAge;

  clearCurrentUserInfoInSession: ClearCurrentUserInfoInSession<SS>;

  clearCurrentUserInfoInSessionIfNecessary: ClearCurrentUserInfoInSessionIfNecessary<SS>;

  buildResponse: BuildResponse;

  generateAuthorizationPage: GenerateAuthorizationPage<SS>;

  checkSubject: CheckSubject;

  calcSub: CalcSub;

  buildAuthorizationFailError: BuildAuthorizationFailError;

  handleNoInteraction: HandleNoInteraction<SS>;

  processApiResponse: ProcessApiResponse<AuthorizationResponse>;

  handle: Handle<AuthorizationRequest>;

  constructor({
    baseHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
    authorizationPageModelConfiguration,
  }: AuthorizationHandlerConfigurationImplConstructorParams<SS>) {
    const {
      apiClient,
      session,
      buildUnknownActionMessage,
      recoverResponseResult,
    } = baseHandlerConfiguration;

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
        authorizationPageModelConfiguration.buildAuthorizationPageModel,
      clearCurrentUserInfoInSessionIfNecessary:
        this.clearCurrentUserInfoInSessionIfNecessary,
      buildResponse: this.buildResponse,
    });

    this.checkSubject = defaultCheckSubject;

    this.calcSub = defaultCalcSub;

    this.buildAuthorizationFailError = createBuildAuthorizationFailError(
      authorizationFailHandlerConfiguration.handle
    );

    this.handleNoInteraction = createHandleNoInteraction({
      checkAuthAge: this.checkAuthAge,
      checkSubject: this.checkSubject,
      calcSub: this.calcSub,
      buildAuthorizationFailError: this.buildAuthorizationFailError,
      handle4AuthorizationIssue: authorizationIssueHandlerConfiguration.handle,
    });

    this.processApiResponse = createProcessApiResponse({
      session,
      path: this.path,
      generateAuthorizationPage: this.generateAuthorizationPage,
      handleNoInteraction: this.handleNoInteraction,
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