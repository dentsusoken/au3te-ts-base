/*
 * Copyright (C) 2019-2024 Authlete, Inc.
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
} from 'au3te-ts-common/schemas.authorization.fail';

export const AUTHORIZATION_FAIL_PATH = '/api/auth/authorization/fail';

export type AuthorizationFailHandlerConstructorOptions<
  REQ extends object,
  RES
> = {
  processApiResponse?: ProcessApiResponse<RES>;
  processApiRequest?: ProcessApiRequest<REQ, RES>;
  recoverResponseResult?: RecoverResponseResult;
  handle?: Handle<AuthorizationFailRequest>;
} & BaseHandlerConstructorOptions;

export class AuthorizationFailHandler<
  REQ extends AuthorizationFailRequest = AuthorizationFailRequest,
  RES extends AuthorizationFailResponse = AuthorizationFailResponse
> extends BaseHandler {
  apiClient: ApiClient;
  processApiResponse: ProcessApiResponse<RES>;
  processApiRequest: ProcessApiRequest<REQ, RES>;
  recoverResponseResult: RecoverResponseResult;
  handle: Handle<REQ>;

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
