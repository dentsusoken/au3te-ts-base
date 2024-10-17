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

import { ApiClient } from 'au3te-ts-common/api';
import {
  ServiceConfReqHandler,
  ServiceConfReqHandlerConstructorOptions,
} from '../../handler/service-configuration/ServiceConfReqHandler';
import { BaseEndpoint, BaseEndpointConstructorOptions } from '../BaseEndpoint';
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest, createProcessRequest } from '../processRequest';
import { createToApiRequest } from './toApiRequest';
import {
  ServiceConfigurationRequest,
  ServiceConfigurationResponse,
} from 'au3te-ts-common/schemas.service.configuration';

export type ServiceConfReqEndpointConstructorOptions = {
  toApiRequest?: ToApiRequest<ServiceConfigurationRequest>;
  processRequest?: ProcessRequest;
} & BaseEndpointConstructorOptions &
  ServiceConfReqHandlerConstructorOptions<
    ServiceConfigurationRequest,
    ServiceConfigurationResponse
  >;

export class ServiceConfReqEndpoint extends BaseEndpoint {
  apiClient: ApiClient;
  handler: ServiceConfReqHandler;
  toApiRequest: ToApiRequest<ServiceConfigurationRequest>;
  processRequest: ProcessRequest;

  constructor(
    apiClient: ApiClient,
    options: ServiceConfReqEndpointConstructorOptions = {}
  ) {
    super(options);
    this.apiClient = apiClient;
    this.handler = new ServiceConfReqHandler(apiClient, options);
    this.toApiRequest = options.toApiRequest ?? createToApiRequest();
    this.processRequest =
      options.processRequest ??
      createProcessRequest({
        toApiRequest: this.toApiRequest,
        handle: this.handler.handle,
      });
  }
}
