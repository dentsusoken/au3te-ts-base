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
  IntrospectionRequest,
  IntrospectionResponse,
} from 'au3te-ts-common/schemas.introspection';
import { ProcessApiRequest } from '../processApiRequest';
import { ValidateApiResponse } from '../validateApiResponse';
import { ProcessApiRequestWithValidation } from '../processApiRequestWithValidation';

/**
 * Configuration interface for the Introspection handler.
 */
export interface IntrospectionHandlerConfiguration {
  /**
   * The path for the introspection endpoint.
   */
  path: string;

  /**
   * Function to process the API request for introspection.
   */
  processApiRequest: ProcessApiRequest<
    IntrospectionRequest,
    IntrospectionResponse
  >;

  /**
   * Function to validate the API response for introspection.
   */
  validateApiResponse: ValidateApiResponse<IntrospectionResponse>;

  /**
   * Function to process the API request with validation.
   * This function handles both processing the request and validating the response.
   */
  processApiRequestWithValidation: ProcessApiRequestWithValidation<
    IntrospectionRequest,
    IntrospectionResponse
  >;
}
