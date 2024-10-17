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

import { ServiceConfigurationResponse } from 'au3te-ts-common/schemas.service.configuration';
import { ProcessApiResponse } from '../processApiResponse';
import * as responseFactory from '../../utils/responseFactory';

/**
 * Creates a ProcessApiResponse function that handles different API response actions.
 *
 * @function createProcessApiResponse
 * @param {BuildUnknownActionMessage} buildUnknownActionMessage - A function to build an error message for unknown actions.
 * @returns {ProcessApiResponse} A function that processes API responses and returns appropriate HTTP responses.
 */
export const createProcessApiResponse =
  (): ProcessApiResponse<ServiceConfigurationResponse> =>
  async (apiResponse: ServiceConfigurationResponse): Promise<Response> => {
    return responseFactory.ok(JSON.stringify(apiResponse));
  };
