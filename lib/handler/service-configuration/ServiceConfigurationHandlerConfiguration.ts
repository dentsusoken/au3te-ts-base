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
} from 'au3te-ts-common/schemas.service-configuration';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { Handle } from '../handle';
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest } from '../processRequest';

/**
 * Configuration interface for the Service Configuration handler.
 */
export interface ServiceConfigurationHandlerConfiguration {
  /**
   * The path for the service configuration endpoint.
   */
  path: string;

  /**
   * Function to process the API request for service configuration.
   */
  processApiRequest: ProcessApiRequest<
    ServiceConfigurationRequest,
    ServiceConfigurationResponse
  >;

  /**
   * Function to process the API response for service configuration.
   */
  processApiResponse: ProcessApiResponse<ServiceConfigurationResponse>;

  /**
   * Function to handle the service configuration request.
   */
  handle: Handle<ServiceConfigurationRequest>;

  /**
   * Function to convert an HTTP request to a ServiceConfigurationRequest.
   */
  toApiRequest: ToApiRequest<ServiceConfigurationRequest>;

  /**
   * Function to process incoming HTTP requests to the service configuration endpoint.
   */
  processRequest: ProcessRequest;
}
