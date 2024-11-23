/*
 * Copyright (C) 2012024 Authlete, Inc.
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
  introspectionResponseSchema,
} from 'au3te-ts-common/schemas.introspection';
import { ProcessApiRequest } from '../processApiRequest';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { IntrospectionHandlerConfiguration } from './IntrospectionHandlerConfiguration';
import { ValidateApiResponse } from '../validateApiResponse';
import {
  createProcessApiRequestWithValidation,
  ProcessApiRequestWithValidation,
} from '../processApiRequestWithValidation';
import { createValidateApiResponse } from './validateApiResponse';
import { SessionSchemas } from '../../session/types';
import { sessionSchemas } from '../../session/sessionSchemas';

/**
 * Implementation of the IntrospectionHandlerConfiguration interface.
 * This class configures the handling of introspection requests.
 */
export class IntrospectionHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements IntrospectionHandlerConfiguration
{
  /** The path for the introspection endpoint. */
  path: string = '/api/introspection';

  /** Function to process the API request for introspection. */
  processApiRequest: ProcessApiRequest<
    IntrospectionRequest,
    IntrospectionResponse
  >;

  /** Function to validate the API response for introspection. */
  validateApiResponse: ValidateApiResponse<IntrospectionResponse>;

  /** Function to process the API request with validation. */
  processApiRequestWithValidation: ProcessApiRequestWithValidation<
    IntrospectionRequest,
    IntrospectionResponse
  >;

  /**
   * Creates an instance of IntrospectionHandlerConfigurationImpl.
   */
  constructor(baseHandlerConfiguration: BaseHandlerConfiguration<SS>) {
    const { apiClient, buildUnknownActionMessage, prepareHeaders } =
      baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.introspectionPath,
      introspectionResponseSchema,
      apiClient
    );

    this.validateApiResponse = createValidateApiResponse({
      path: this.path,
      buildUnknownActionMessage,
      prepareHeaders,
    });

    this.processApiRequestWithValidation =
      createProcessApiRequestWithValidation({
        processApiRequest: this.processApiRequest,
        validateApiResponse: this.validateApiResponse,
      });
  }
}
