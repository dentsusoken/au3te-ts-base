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

/**
 * The path for the Pushed Authorization Request (PAR) endpoint.
 */
export const PAR_PATH = '/api/par';

/**
 * Options for constructing a PushedAuthReqHandler.
 * @template REQ - The type of the request object.
 * @template RES - The type of the response object.
 */
export type PushedAuthReqHandlerConstructorOptions<REQ extends object, RES> = {
  processApiResponse?: ProcessApiResponse<RES>;
  processApiRequest?: ProcessApiRequest<REQ, RES>;
  recoverResponseResult?: RecoverResponseResult;
  handle?: Handle<REQ>;
} & BaseHandlerConstructorOptions;

/**
 * Handler for Pushed Authorization Requests (PAR).
 * @template REQ - The type of the request object, extending PushedAuthReqRequest.
 * @template RES - The type of the response object, extending PushedAuthReqResponse.
 */
export class PushedAuthReqHandler<
  REQ extends PushedAuthReqRequest = PushedAuthReqRequest,
  RES extends PushedAuthReqResponse = PushedAuthReqResponse
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
   * Constructs a new PushedAuthReqHandler.
   * @param apiClient - The API client to use for requests.
   * @param options - Options for configuring the handler.
   */
  constructor(
    apiClient: ApiClient,
    options: PushedAuthReqHandlerConstructorOptions<REQ, RES> = {}
  ) {
    super(PAR_PATH, options);
    this.apiClient = apiClient;
    this.processApiResponse =
      options.processApiResponse ??
      (createProcessApiResponse(
        this.buildUnknownActionMessage
      ) as ProcessApiResponse<RES>);
    this.processApiRequest =
      options.processApiRequest ??
      (createProcessApiRequest(
        apiClient.pushAuthorizationRequestPath,
        pushedAuthReqResponseSchema,
        this.apiClient
      ) as ProcessApiRequest<REQ, RES>);
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
