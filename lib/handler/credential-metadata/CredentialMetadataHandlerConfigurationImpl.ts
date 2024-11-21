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
  CredentialIssuerMetadataRequest,
  CredentialIssuerMetadataResponse,
  credentialIssuerMetadataResponseSchema,
} from 'au3te-ts-common/schemas.credential-metadata';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { CredentialMetadataHandlerConfiguration } from './CredentialMetadataHandlerConfiguration';
import { ValidateApiResponse } from '../validateApiResponse';
import {
  createProcessApiRequestWithValidation,
  ProcessApiRequestWithValidation,
} from '../processApiRequestWithValidation';
import { createValidateApiResponse } from './validateApiResponse';

/**
 * Implementation of the CredentialMetadataHandlerConfiguration interface.
 * This class configures the handling of credential metadata requests.
 */
export class CredentialMetadataHandlerConfigurationImpl<
  SS extends SessionSchemas
> implements CredentialMetadataHandlerConfiguration
{
  /** The path for the credential metadata endpoint. */
  path: string = '/.well-known/openid-credential-issuer';

  /** Function to process the API request for credential metadata. */
  processApiRequest: ProcessApiRequest<
    CredentialIssuerMetadataRequest,
    CredentialIssuerMetadataResponse
  >;

  /** Function to validate the API response for credential metadata. */
  validateApiResponse: ValidateApiResponse<CredentialIssuerMetadataResponse>;

  /** Function to process the API request with validation. */
  processApiRequestWithValidation: ProcessApiRequestWithValidation<
    CredentialIssuerMetadataRequest,
    CredentialIssuerMetadataResponse
  >;

  /** Function to process the API response for credential metadata. */
  processApiResponse: ProcessApiResponse<CredentialIssuerMetadataResponse>;

  /** Function to handle the credential metadata request. */
  handle: Handle<CredentialIssuerMetadataRequest>;

  /**
   * Creates an instance of CredentialMetadataHandlerConfigurationImpl.
   * @param {BaseHandlerConfiguration<SS>} baseHandlerConfiguration - The base handler configuration.
   */
  constructor(baseHandlerConfiguration: BaseHandlerConfiguration<SS>) {
    const { apiClient, buildUnknownActionMessage, recoverResponseResult } =
      baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.credentialIssuerMetadataPath,
      credentialIssuerMetadataResponseSchema,
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
  }
}
