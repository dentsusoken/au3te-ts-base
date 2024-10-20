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

import { BaseHandler, BaseHandlerConstructorOptions } from '../BaseHandler';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import {
  createProcessApiRequest,
  ProcessApiRequest,
} from 'au3te-ts-common/handler';
import { createHandle, Handle } from '../handle';
import {
  RecoverResponseResult,
  createRecoverResponseResult,
} from '../recoverResponseResult';
import { ApiClient } from 'au3te-ts-common/api';
import {
  AuthorizationFailRequest,
  AuthorizationFailResponse,
  authorizationFailResponseSchema,
} from 'au3te-ts-common/schemas.authorization-fail';

/**
 * The path for the authorization fail API endpoint.
 */
export const AUTHORIZATION_FAIL_PATH = '/api/auth/authorization/fail';

/**
 * Options for constructing an AuthorizationFailHandler.
 * @template REQ - The type of the request object.
 * @template RES - The type of the response object.
 */
export type AuthorizationFailHandlerConstructorOptions<
  REQ extends object,
  RES
> = {
  /**
   * Function to process the API response.
   */
  processApiResponse?: ProcessApiResponse<RES>;
  /**
   * Function to process the API request.
   */
  processApiRequest?: ProcessApiRequest<REQ, RES>;
  /**
   * Function to recover from a response result.
   */
  recoverResponseResult?: RecoverResponseResult;
  /**
   * Function to handle the request.
   */
  handle?: Handle<AuthorizationFailRequest>;
} & BaseHandlerConstructorOptions;

/**
 * Handler for authorization fail requests.
 * @template REQ - The type of the request object, extending AuthorizationFailRequest.
 * @template RES - The type of the response object, extending AuthorizationFailResponse.
 */
export class AuthorizationFailHandler<
  REQ extends AuthorizationFailRequest = AuthorizationFailRequest,
  RES extends AuthorizationFailResponse = AuthorizationFailResponse
> extends BaseHandler {
  /**
   * The API client used for making requests.
   */
  apiClient: ApiClient;
  /**
   * Function to process the API response.
   */
  processApiResponse: ProcessApiResponse<RES>;
  /**
   * Function to process the API request.
   */
  processApiRequest: ProcessApiRequest<REQ, RES>;
  /**
   * Function to recover from a response result.
   */
  recoverResponseResult: RecoverResponseResult;
  /**
   * Function to handle the request.
   */
  handle: Handle<REQ>;

  /**
   * Creates an instance of AuthorizationFailHandler.
   * @param {ApiClient} apiClient - The API client to use for requests.
   * @param {AuthorizationFailHandlerConstructorOptions<REQ, RES>} [options={}] - Options for configuring the handler.
   */
  constructor(
    apiClient: ApiClient,
    options: AuthorizationFailHandlerConstructorOptions<REQ, RES> = {}
  ) {
    super(AUTHORIZATION_FAIL_PATH, options);
    this.apiClient = apiClient;
    this.processApiResponse =
      options.processApiResponse ??
      createProcessApiResponse(this.buildUnknownActionMessage);
    this.processApiRequest =
      options.processApiRequest ??
      (createProcessApiRequest(
        apiClient.authorizationFailPath,
        authorizationFailResponseSchema,
        this.apiClient
      ) as ProcessApiRequest<REQ, RES>);
    this.recoverResponseResult =
      options.recoverResponseResult ??
      createRecoverResponseResult(this.processError);
    this.handle =
      options.handle ??
      (createHandle({
        processApiRequest: this.processApiRequest,
        processApiResponse: this.processApiResponse,
        recoverResponseResult: this.recoverResponseResult,
      }) as Handle<REQ>);
  }
}
