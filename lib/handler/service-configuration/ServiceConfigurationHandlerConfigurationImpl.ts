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
  ServiceConfigurationRequest,
  ServiceConfigurationResponse,
  serviceConfigurationResponseSchema,
} from 'au3te-ts-common/schemas.service-configuration';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { defaultProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ServiceConfigurationHandlerConfiguration } from './ServiceConfigurationHandlerConfiguration';
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest } from '../processRequest';
import { defaultToApiRequest } from './toApiRequest';
import { createProcessRequest } from '../processRequest';
import { sessionSchemas } from '../../session/sessionSchemas';

/**
 * Implementation of the ServiceConfigurationHandlerConfiguration interface.
 * This class configures the handling of service configuration requests.
 */
export class ServiceConfigurationHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements ServiceConfigurationHandlerConfiguration
{
  /** The path for the service configuration endpoint. */
  path: string = '/.well-known/openid-configuration';

  /** Function to process the API request for service configuration. */
  processApiRequest: ProcessApiRequest<
    ServiceConfigurationRequest,
    ServiceConfigurationResponse
  >;

  /** Function to process the API response for service configuration. */
  processApiResponse: ProcessApiResponse<ServiceConfigurationResponse>;

  /** Function to handle the service configuration request. */
  handle: Handle<ServiceConfigurationRequest>;

  /** Function to convert HTTP requests to service configuration API requests */
  toApiRequest: ToApiRequest<ServiceConfigurationRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates an instance of ServiceConfigurationHandlerConfigurationImpl.
   */
  constructor(baseHandlerConfiguration: BaseHandlerConfiguration<SS>) {
    const { apiClient, recoverResponseResult } = baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.serviceConfigurationPath,
      serviceConfigurationResponseSchema,
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
