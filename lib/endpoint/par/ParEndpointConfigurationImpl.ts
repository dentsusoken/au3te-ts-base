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

import { PushedAuthReqRequest } from 'au3te-ts-common/schemas.par';
import { BaseHandlerConfiguration } from '../../handler/BaseHandlerConfiguration';
import { ParHandlerConfigurationImpl } from '../../handler/par';
import { SessionSchemas } from '../../session';
import { sessionSchemas } from '../../session/sessionSchemas';
import { createProcessRequest, ProcessRequest } from '../processRequest';
import { ParEndpointConfiguration } from './ParEndpointConfiguration';
import { createToApiRequest } from './toApiRequest';
import { ToApiRequest } from '../toApiRequest';
import { ExtractorConfiguration } from '../../extractor/ExtractorConfiguration';

/**
 * Implementation of the Pushed Authorization Request (PAR) endpoint configuration.
 * Handles conversion of HTTP requests to PAR API requests and processes them.
 *
 * @template SS - Type of session schemas, defaults to the standard session schemas
 * @implements {ParEndpointConfiguration}
 */
export class ParEndpointConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements ParEndpointConfiguration
{
  /** Function to convert HTTP requests to PAR API requests */
  toApiRequest: ToApiRequest<PushedAuthReqRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates a new PAR endpoint configuration instance.
   *
   * @param baseHandlerConfiguration - Base configuration for request handling
   * @param extractorConfiguration - Configuration for extracting data from requests
   */
  constructor(
    baseHandlerConfiguration: BaseHandlerConfiguration<SS>,
    extractorConfiguration: ExtractorConfiguration
  ) {
    this.toApiRequest = createToApiRequest({
      extractParameters: extractorConfiguration.extractParameters,
      extractClientCredentials: extractorConfiguration.extractClientCredentials,
      extractClientCertificateAndPath:
        extractorConfiguration.extractClientCertificateAndPath,
    });

    const parHandlerConfiguration = new ParHandlerConfigurationImpl(
      baseHandlerConfiguration
    );

    this.processRequest = createProcessRequest({
      path: parHandlerConfiguration.path,
      toApiRequest: this.toApiRequest,
      handle: parHandlerConfiguration.handle,
      recoverResponseResult: baseHandlerConfiguration.recoverResponseResult,
    });
  }
}
