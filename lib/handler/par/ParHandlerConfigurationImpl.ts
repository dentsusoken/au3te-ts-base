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
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest } from '../processRequest';
import { ExtractorConfiguration } from '../../extractor/ExtractorConfiguration';
import { createToApiRequest } from '../toClientAuthRequest';
import { createProcessRequest } from '../processRequest';
import { sessionSchemas } from '../../session/sessionSchemas';

/**
 * Implementation of the ParHandlerConfiguration interface.
 * This class configures and handles Pushed Authorization Requests (PAR).
 */
export class ParHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements ParHandlerConfiguration
{
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

  /** Function to convert HTTP requests to PAR API requests */
  toApiRequest: ToApiRequest<PushedAuthReqRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates an instance of ParHandlerConfigurationImpl.
   */
  constructor({
    baseHandlerConfiguration,
    extractorConfiguration,
  }: {
    baseHandlerConfiguration: BaseHandlerConfiguration<SS>;
    extractorConfiguration: ExtractorConfiguration;
  }) {
    const {
      apiClient,
      buildUnknownActionMessage,
      recoverResponseResult,
      prepareHeaders,
    } = baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.pushAuthorizationRequestPath,
      pushedAuthReqResponseSchema,
      apiClient
    );

    this.processApiResponse = createProcessApiResponse({
      path: this.path,
      buildUnknownActionMessage,
      prepareHeaders,
    });

    this.handle = createHandle({
      path: this.path,
      processApiRequest: this.processApiRequest,
      processApiResponse: this.processApiResponse,
      recoverResponseResult,
    });

    this.toApiRequest = createToApiRequest({
      extractParameters: extractorConfiguration.extractParameters,
      extractClientCredentials: extractorConfiguration.extractClientCredentials,
      extractClientCertificateAndPath:
        extractorConfiguration.extractClientCertificateAndPath,
    });

    this.processRequest = createProcessRequest({
      path: this.path,
      toApiRequest: this.toApiRequest,
      handle: this.handle,
      recoverResponseResult,
    });
  }
}
