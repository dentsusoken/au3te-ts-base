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
} from '@vecrea/au3te-ts-common/schemas.credential-metadata';
import { ProcessApiRequest } from '../core/processApiRequest';
import { ProcessApiResponse } from '../core/processApiResponse';
import { Handle } from '../core/handle';
import { ValidateApiResponse } from '../core/validateApiResponse';
import { ProcessApiRequestWithValidation } from '../core/processApiRequestWithValidation';
import { ToApiRequest } from '../core/toApiRequest';
import { ProcessRequest } from '../core/processRequest';

/**
 * Configuration interface for the Credential Metadata handler.
 */
export interface CredentialMetadataHandlerConfiguration {
  /**
   * The path for the credential metadata endpoint.
   */
  path: string;

  /**
   * Function to process the API request for credential metadata.
   */
  processApiRequest: ProcessApiRequest<
    CredentialIssuerMetadataRequest,
    CredentialIssuerMetadataResponse
  >;

  /**
   * Function to validate the API response for credential metadata.
   */
  validateApiResponse: ValidateApiResponse<CredentialIssuerMetadataResponse>;

  /**
   * Function to process the API request with validation.
   * This function handles both processing the request and validating the response.
   */
  processApiRequestWithValidation: ProcessApiRequestWithValidation<
    CredentialIssuerMetadataRequest,
    CredentialIssuerMetadataResponse
  >;

  /**
   * Function to process the API response for credential metadata.
   */
  processApiResponse: ProcessApiResponse<CredentialIssuerMetadataResponse>;

  /**
   * Function to handle the credential metadata request.
   */
  handle: Handle<CredentialIssuerMetadataRequest>;

  /**
   * Function to convert an HTTP request to a CredentialIssuerMetadataRequest.
   */
  toApiRequest: ToApiRequest<CredentialIssuerMetadataRequest>;

  /**
   * Function to process incoming HTTP requests to the credential metadata endpoint.
   */
  processRequest: ProcessRequest;
}
