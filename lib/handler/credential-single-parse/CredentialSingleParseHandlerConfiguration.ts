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
  CredentialSingleParseRequest,
  CredentialSingleParseResponse,
} from 'au3te-ts-common/schemas.credential-single-parse';
import { ProcessApiRequest } from '../processApiRequest';
import { ValidateApiResponse } from '../validateApiResponse';
import { ProcessApiRequestWithValidation } from '../processApiRequestWithValidation';
import { ValidateCredentialSingleParseResponseOptions } from './validateApiResponse';

/**
 * Configuration interface for handling credential single parse operations.
 * Defines the structure for processing and validating credential parse requests and responses.
 */
export interface CredentialSingleParseHandlerConfiguration {
  /**
   * The endpoint path for credential single parse operations.
   * This path is used to route requests to the appropriate handler.
   */
  path: string;

  /**
   * Processes credential single parse API requests.
   * Handles the communication with the Authlete API endpoint for credential parsing.
   */
  processApiRequest: ProcessApiRequest<
    CredentialSingleParseRequest,
    CredentialSingleParseResponse
  >;

  /**
   * Validates credential single parse API responses.
   * Performs validation checks and error handling based on the response content.
   * Supports custom response headers through ValidateCredentialSingleParseResponseOptions.
   */
  validateApiResponse: ValidateApiResponse<
    CredentialSingleParseResponse,
    ValidateCredentialSingleParseResponseOptions
  >;

  /**
   * Combines request processing and response validation into a single operation.
   * Provides a streamlined way to handle the complete request-response cycle
   * with integrated validation and error handling.
   */
  processApiRequestWithValidation: ProcessApiRequestWithValidation<
    CredentialSingleParseRequest,
    CredentialSingleParseResponse,
    ValidateCredentialSingleParseResponseOptions
  >;
}
