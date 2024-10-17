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

import {
  PushedAuthReqRequest,
  PushedAuthReqResponse,
} from 'au3te-ts-common/schemas.par';
import { ApiClient } from 'au3te-ts-common/api';
import {
  PushedAuthReqHandler,
  PushedAuthReqHandlerConstructorOptions,
} from '../../handler/par/PushedAuthReqHandler';
import { BaseEndpoint, BaseEndpointConstructorOptions } from '../BaseEndpoint';
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest, createProcessRequest } from '../processRequest';
import { createToApiRequest } from './toApiRequest';

/**
 * Options for constructing a PushedAuthReqEndpoint.
 */
export type PushedAuthReqEndpointConstructorOptions = {
  /**
   * Function to convert the request to an API request.
   */
  toApiRequest?: ToApiRequest<PushedAuthReqRequest>;
  /**
   * Function to process the request.
   */
  processRequest?: ProcessRequest;
} & BaseEndpointConstructorOptions &
  PushedAuthReqHandlerConstructorOptions<
    PushedAuthReqRequest,
    PushedAuthReqResponse
  >;

/**
 * Endpoint for handling Pushed Authorization Requests (PAR).
 */
export class PushedAuthReqEndpoint extends BaseEndpoint {
  /**
   * The API client used for making requests.
   */
  apiClient: ApiClient;

  /**
   * The handler for Pushed Authorization Requests.
   */
  handler: PushedAuthReqHandler;

  /**
   * Function to convert the request to an API request.
   */
  toApiRequest: ToApiRequest<PushedAuthReqRequest>;

  /**
   * Function to process the request.
   */
  processRequest: ProcessRequest;

  /**
   * Constructs a new PushedAuthReqEndpoint.
   * @param apiClient - The API client to use for requests.
   * @param options - Options for configuring the endpoint.
   */
  constructor(
    apiClient: ApiClient,
    options: PushedAuthReqEndpointConstructorOptions = {}
  ) {
    super(options);
    this.apiClient = apiClient;
    this.handler = new PushedAuthReqHandler(apiClient, options);
    this.toApiRequest =
      options.toApiRequest ??
      createToApiRequest({
        extractParameters: this.extractParameters,
        extractClientCredentials: this.extractClientCredentials,
        extractClientCertificateAndPath: this.extractClientCertificateAndPath,
      });
    this.processRequest =
      options.processRequest ??
      createProcessRequest({
        toApiRequest: this.toApiRequest,
        handle: this.handler.handle,
      });
  }
}
