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
  credentialSingleParseResponseSchema,
} from 'au3te-ts-common/schemas.credential-single-parse';
import { ProcessApiRequest } from '../processApiRequest';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { CredentialSingleParseHandlerConfiguration } from './CredentialSingleParseHandlerConfiguration';
import { ValidateApiResponse } from '../validateApiResponse';
import {
  createProcessApiRequestWithValidation,
  ProcessApiRequestWithValidation,
} from '../processApiRequestWithValidation';
import { createValidateApiResponse } from './validateApiResponse';
import { SessionSchemas } from '../../session/types';
import { sessionSchemas } from '../../session/sessionSchemas';
import { CredentialApiOptions } from '../credential/types';

/**
 * Implementation of the CredentialSingleParseHandlerConfiguration interface.
 * This class configures the handling of credential single parse requests.
 *
 * @template SS - Type parameter extending SessionSchemas, defaults to sessionSchemas
 */
export class CredentialSingleParseHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements CredentialSingleParseHandlerConfiguration
{
  /** The endpoint path for credential single parse operations */
  path: string = '/api/credential/single/parse';

  /**
   * Function to process the API request for credential single parse.
   * Handles the communication with the Authlete API endpoint.
   */
  processApiRequest: ProcessApiRequest<
    CredentialSingleParseRequest,
    CredentialSingleParseResponse
  >;

  /**
   * Function to validate the API response for credential single parse.
   * Performs validation and error handling based on the response action.
   */
  validateApiResponse: ValidateApiResponse<
    CredentialSingleParseResponse,
    CredentialApiOptions
  >;

  /**
   * Function that combines API request processing with response validation.
   * Provides a complete request-response cycle with built-in validation.
   */
  processApiRequestWithValidation: ProcessApiRequestWithValidation<
    CredentialSingleParseRequest,
    CredentialSingleParseResponse,
    CredentialApiOptions
  >;

  /**
   * Creates an instance of CredentialSingleParseHandlerConfigurationImpl.
   *
   * @param baseHandlerConfiguration - Base configuration containing API client and utility functions
   */
  constructor(baseHandlerConfiguration: BaseHandlerConfiguration<SS>) {
    const { apiClient, buildUnknownActionMessage } = baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.credentialSingleParsePath,
      credentialSingleParseResponseSchema,
      apiClient
    );

    this.validateApiResponse = createValidateApiResponse({
      path: this.path,
      buildUnknownActionMessage,
    });

    this.processApiRequestWithValidation =
      createProcessApiRequestWithValidation<
        CredentialSingleParseRequest,
        CredentialSingleParseResponse,
        CredentialApiOptions
      >({
        processApiRequest: this.processApiRequest,
        validateApiResponse: this.validateApiResponse,
      });
  }
}
