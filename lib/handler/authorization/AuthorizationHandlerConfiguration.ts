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
} from '@vecrea/au3te-ts-common/schemas.authorization';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { Handle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { GenerateAuthorizationPage } from './generateAuthorizationPage';
import { HandleNoInteraction } from './handleNoInteraction';
import { ResponseToDecisionParams } from './responseToDecisionParams';
import { ClearCurrentUserInfoInSessionIfNecessary } from './clearCurrentUserInfoInSessionIfNecessary';
import { BuildResponse } from './buildResponse';
import { CheckPrompts } from './checkPrompts';
import { CheckAuthAge } from './checkAuthAge';
import { ClearCurrentUserInfoInSession } from './clearCurrentUserInfoInSession';
import { CheckSubject } from './checkSubject';
import { CalcSub } from './calcSub';
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest } from '../processRequest';

/**
 * Configuration interface for the Authorization handler.
 */
export interface AuthorizationHandlerConfiguration<SS extends SessionSchemas> {
  /**
   * The path for the authorization endpoint.
   */
  path: string;

  /**
   * Function to process the API request for authorization.
   */
  processApiRequest: ProcessApiRequest<
    AuthorizationRequest,
    AuthorizationResponse
  >;

  /**
   * Function to convert authorization response to decision parameters
   */
  responseToDecisionParams: ResponseToDecisionParams;

  /**
   * Function to validate prompt parameters in the authorization request
   */
  checkPrompts: CheckPrompts;

  /**
   * Function to check authentication age
   */
  checkAuthAge: CheckAuthAge;

  /**
   * Function to clear current user information from the session
   */
  clearCurrentUserInfoInSession: ClearCurrentUserInfoInSession<SS>;

  /**
   * Function to conditionally clear current user information from the session
   */
  clearCurrentUserInfoInSessionIfNecessary: ClearCurrentUserInfoInSessionIfNecessary<SS>;

  /**
   * Function to build the authorization response
   */
  buildResponse: BuildResponse;

  /**
   * Function to generate the authorization consent page
   */
  generateAuthorizationPage: GenerateAuthorizationPage<SS>;

  /**
   * Function to validate the subject identifier
   */
  checkSubject: CheckSubject;

  /**
   * Function to calculate the subject identifier
   */
  calcSub: CalcSub;

  /**
   * Function to handle no-interaction authorization requests
   */
  handleNoInteraction: HandleNoInteraction<SS>;

  /**
   * Function to process the API response for authorization
   */
  processApiResponse: ProcessApiResponse<AuthorizationResponse>;

  /**
   * Function to handle the authorization request
   */
  handle: Handle<AuthorizationRequest>;

  /**
   * Function to convert an HTTP request to an AuthorizationRequest.
   */
  toApiRequest: ToApiRequest<AuthorizationRequest>;

  /**
   * Function to process incoming HTTP requests to the authorization endpoint.
   */
  processRequest: ProcessRequest;
}
