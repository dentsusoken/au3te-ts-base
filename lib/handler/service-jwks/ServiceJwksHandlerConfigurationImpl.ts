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
  ServiceJwksRequest,
  ServiceJwksResponse,
  serviceJwksResponseSchema,
} from '@vecrea/au3te-ts-common/schemas.service-jwks';
import {
  createProcessGetApiRequest,
  ProcessApiRequest,
} from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { defaultProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { ServerHandlerConfiguration } from '../ServerHandlerConfiguration';
import { ServiceJwksHandlerConfiguration } from './ServiceJwksHandlerConfiguration';
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest } from '../processRequest';
import { defaultToApiRequest } from './toApiRequest';
import { createProcessRequest } from '../processRequest';
import { sessionSchemas } from '../../session/sessionSchemas';

/** The path for the service JWKS endpoint */
export const SERVICE_JWKS_PATH = '/api/jwks';
/**
 * Implementation of the ServiceJwksHandlerConfiguration interface.
 * This class configures the handling of service configuration requests.
 */
export class ServiceJwksHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements ServiceJwksHandlerConfiguration
{
  /** The path for the service configuration endpoint. */
  path: string = SERVICE_JWKS_PATH;

  /** Function to process the API request for service configuration. */
  processApiRequest: ProcessApiRequest<ServiceJwksRequest, ServiceJwksResponse>;

  /** Function to process the API response for service configuration. */
  processApiResponse: ProcessApiResponse<ServiceJwksResponse>;

  /** Function to handle the service configuration request. */
  handle: Handle<ServiceJwksRequest>;

  /** Function to convert HTTP requests to service configuration API requests */
  toApiRequest: ToApiRequest<ServiceJwksRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates an instance of ServiceJwksHandlerConfigurationImpl.
   */
  constructor(serverHandlerConfiguration: ServerHandlerConfiguration<SS>) {
    const { apiClient, recoverResponseResult } = serverHandlerConfiguration;

    this.processApiRequest = createProcessGetApiRequest(
      apiClient.serviceJwksPath,
      serviceJwksResponseSchema,
      apiClient
    );

    this.processApiResponse = defaultProcessApiResponse;

    this.handle = createHandle({
      path: this.path,
      processApiRequest: this.processApiRequest,
      processApiResponse: this.processApiResponse,
      recoverResponseResult,
    });

    this.toApiRequest = defaultToApiRequest;

    this.processRequest = createProcessRequest({
      path: this.path,
      toApiRequest: this.toApiRequest,
      handle: this.handle,
      recoverResponseResult,
    });
  }
}
