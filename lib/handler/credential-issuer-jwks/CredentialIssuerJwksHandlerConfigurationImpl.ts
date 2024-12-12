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
  CredentialIssuerJwksRequest,
  CredentialIssuerJwksResponse,
  credentialIssuerJwksResponseSchema,
} from 'au3te-ts-common/schemas.credential-issuer-jwks';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { CredentialIssuerJwksHandlerConfiguration } from './CredentialIssuerJwksHandlerConfiguration';
import { ValidateApiResponse } from '../validateApiResponse';
import {
  createProcessApiRequestWithValidation,
  ProcessApiRequestWithValidation,
} from '../processApiRequestWithValidation';
import { createValidateApiResponse } from './validateApiResponse';
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest } from '../processRequest';
import { defaultToApiRequest } from './toApiRequest';
import { createProcessRequest } from '../processRequest';
import { sessionSchemas } from '../../session/sessionSchemas';

/**
 * Implementation of the CredentialIssuerJwksHandlerConfiguration interface.
 * This class configures the handling of credential issuer JWKS requests.
 */
export class CredentialIssuerJwksHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements CredentialIssuerJwksHandlerConfiguration
{
  /** The path for the credential issuer JWKS endpoint. */
  path: string = '/api/vci/jwks';

  /** Function to process the API request for credential issuer JWKS. */
  processApiRequest: ProcessApiRequest<
    CredentialIssuerJwksRequest,
    CredentialIssuerJwksResponse
  >;

  /** Function to validate the API response for credential issuer JWKS. */
  validateApiResponse: ValidateApiResponse<CredentialIssuerJwksResponse>;

  /** Function to process the API request with validation. */
  processApiRequestWithValidation: ProcessApiRequestWithValidation<
    CredentialIssuerJwksRequest,
    CredentialIssuerJwksResponse
  >;

  /** Function to process the API response for credential issuer JWKS. */
  processApiResponse: ProcessApiResponse<CredentialIssuerJwksResponse>;

  /** Function to handle the credential issuer JWKS request. */
  handle: Handle<CredentialIssuerJwksRequest>;

  /** Function to convert HTTP requests to credential issuer JWKS API requests */
  toApiRequest: ToApiRequest<CredentialIssuerJwksRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates an instance of CredentialIssuerJwksHandlerConfigurationImpl.
   */
  constructor(baseHandlerConfiguration: BaseHandlerConfiguration<SS>) {
    const { apiClient, buildUnknownActionMessage, recoverResponseResult } =
      baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.credentialIssuerJwksPath,
      credentialIssuerJwksResponseSchema,
      apiClient
    );

    this.validateApiResponse = createValidateApiResponse({
      path: this.path,
      buildUnknownActionMessage,
    });

    this.processApiRequestWithValidation =
      createProcessApiRequestWithValidation({
        processApiRequest: this.processApiRequest,
        validateApiResponse: this.validateApiResponse,
      });

    this.processApiResponse = createProcessApiResponse({
      path: this.path,
      buildUnknownActionMessage,
    });

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
