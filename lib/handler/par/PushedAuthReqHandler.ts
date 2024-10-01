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
import {
  PushedAuthReqRequest,
  PushedAuthReqResponse,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import { ApiClient } from 'au3te-ts-common/api';

export const PAR_PATH = '/api/par';

export type PushedAuthReqHandlerConstructorOptions = {
  processApiResponse?: ProcessApiResponse<PushedAuthReqResponse>;
  processApiRequest?: ProcessApiRequest<
    PushedAuthReqRequest,
    PushedAuthReqResponse
  >;
  recoverResponseResult?: RecoverResponseResult;
  handle?: Handle<PushedAuthReqRequest>;
} & BaseHandlerConstructorOptions;

export class PushedAuthReqHandler extends BaseHandler {
  apiClient: ApiClient;
  processApiResponse: ProcessApiResponse<PushedAuthReqResponse>;
  processApiRequest: ProcessApiRequest<
    PushedAuthReqRequest,
    PushedAuthReqResponse
  >;
  recoverResponseResult: RecoverResponseResult;
  handle: Handle<PushedAuthReqRequest>;

  constructor(
    apiClient: ApiClient,
    options: PushedAuthReqHandlerConstructorOptions = {}
  ) {
    super(PAR_PATH, options);
    this.apiClient = apiClient;
    this.processApiResponse =
      options.processApiResponse ??
      createProcessApiResponse(this.buildUnknownActionMessage);
    this.processApiRequest =
      options.processApiRequest ??
      createProcessApiRequest(
        apiClient.pushAuthorizationRequestPath,
        pushedAuthReqResponseSchema,
        this.apiClient
      );
    this.recoverResponseResult =
      options.recoverResponseResult ??
      createRecoverResponseResult(this.processError);
    this.handle =
      options.handle ??
      createHandle({
        processApiRequest: this.processApiRequest,
        processApiResponse: this.processApiResponse,
        recoverResponseResult: this.recoverResponseResult,
      });
  }
}
