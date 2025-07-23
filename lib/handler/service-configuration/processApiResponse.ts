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

import { ServiceConfigurationResponse } from '@vecrea/au3te-ts-common/schemas.service-configuration';
import { ProcessApiResponse } from '../processApiResponse';
import { ResponseFactory } from '../responseFactory';

/**
 * Parameters for creating a process API response function.
 */
type CreateProcessApiResponseParams = {
  /** Factory to create HTTP responses */
  responseFactory: ResponseFactory;
};

/**
 * Creates a function to process API responses for Service Configuration requests.
 *
 * @param {CreateProcessApiResponseParams} params - The parameters for creating the process function.
 * @returns {ProcessApiResponse<ServiceConfigurationResponse>} A function that processes Service Configuration API responses.
 */
export const createProcessApiResponse =
  ({
    responseFactory,
  }: CreateProcessApiResponseParams): ProcessApiResponse<ServiceConfigurationResponse> =>
  /**
   * Processes the API response for Service Configuration requests.
   *
   * @param {ServiceConfigurationResponse} apiResponse - The response from the Authlete API for Service Configuration.
   * @returns {Promise<Response>} A promise that resolves to the HTTP response.
   */
  async (apiResponse: ServiceConfigurationResponse): Promise<Response> => {
    return responseFactory.ok(apiResponse);
  };
