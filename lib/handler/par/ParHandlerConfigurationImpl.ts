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
  PushedAuthReqRequest,
  PushedAuthReqResponse,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ParHandlerConfiguration } from './ParHandlerConfiguration';

/**
 * Implementation of the ParHandlerConfiguration interface.
 * This class configures and handles Pushed Authorization Requests (PAR).
 */
export class ParHandlerConfigurationImpl implements ParHandlerConfiguration {
  /** The path for the PAR endpoint. */
  path: string = '/api/par';

  /** Function to process the API request for PAR. */
  processApiRequest: ProcessApiRequest<
    PushedAuthReqRequest,
    PushedAuthReqResponse
  >;

  /** Function to process the API response for PAR. */
  processApiResponse: ProcessApiResponse<PushedAuthReqResponse>;

  /** Function to handle the PAR request. */
  handle: Handle<PushedAuthReqRequest>;

  /**
   * Creates an instance of ParHandlerConfigurationImpl.
   * @param {BaseHandlerConfiguration<SessionSchemas>} baseHandlerConfiguration - The base handler configuration.
   */
  constructor(
    baseHandlerConfiguration: BaseHandlerConfiguration<SessionSchemas>
  ) {
    const { apiClient, buildUnknownActionMessage, recoverResponseResult } =
      baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.pushAuthorizationRequestPath,
      pushedAuthReqResponseSchema,
      apiClient
    );

    this.processApiResponse = createProcessApiResponse({
      path: this.path,
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
