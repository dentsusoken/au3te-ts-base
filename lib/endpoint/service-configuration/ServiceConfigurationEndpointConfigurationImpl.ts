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

import { ServiceConfigurationRequest } from 'au3te-ts-common/schemas.service-configuration';
import { BaseHandlerConfiguration } from '../../handler/BaseHandlerConfiguration';
import { ServiceConfigurationHandlerConfigurationImpl } from '../../handler/service-configuration';
import { SessionSchemas } from '../../session';
import { sessionSchemas } from '../../session/sessionSchemas';
import { createProcessRequest, ProcessRequest } from '../processRequest';
import { ServiceConfigurationEndpointConfiguration } from './ServiceConfigurationEndpointConfiguration';
import { defaultToApiRequest } from './toApiRequest';
import { ToApiRequest } from '../toApiRequest';

export class ServiceConfigurationEndpointConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements ServiceConfigurationEndpointConfiguration
{
  toApiRequest: ToApiRequest<ServiceConfigurationRequest>;

  processRequest: ProcessRequest;

  constructor(baseHandlerConfiguration: BaseHandlerConfiguration<SS>) {
    this.toApiRequest = defaultToApiRequest;

    const serviceConfigurationHandlerConfiguration =
      new ServiceConfigurationHandlerConfigurationImpl(
        baseHandlerConfiguration
      );
    this.processRequest = createProcessRequest({
      path: serviceConfigurationHandlerConfiguration.path,
      toApiRequest: this.toApiRequest,
      handle: serviceConfigurationHandlerConfiguration.handle,
      recoverResponseResult: baseHandlerConfiguration.recoverResponseResult,
    });
  }
}
