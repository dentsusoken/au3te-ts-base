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
} from 'au3te-ts-common/schemas.credential-issuer-jwks';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { Handle } from '../handle';
import { ValidateApiResponse } from '../validateApiResponse';
import { ProcessApiRequestWithValidation } from '../processApiRequestWithValidation';
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest } from '../processRequest';

/**
 * Configuration interface for the Credential Issuer JWKS handler.
 */
export interface CredentialIssuerJwksHandlerConfiguration {
  /**
   * The path for the credential issuer JWKS endpoint.
   */
  path: string;

  /**
   * Function to process the API request for credential issuer JWKS.
   */
  processApiRequest: ProcessApiRequest<
    CredentialIssuerJwksRequest,
    CredentialIssuerJwksResponse
  >;

  /**
   * Function to validate the API response for credential issuer JWKS.
   */
  validateApiResponse: ValidateApiResponse<CredentialIssuerJwksResponse>;

  /**
   * Function to process the API request with validation.
   * This function handles both processing the request and validating the response.
   */
  processApiRequestWithValidation: ProcessApiRequestWithValidation<
    CredentialIssuerJwksRequest,
    CredentialIssuerJwksResponse
  >;

  /**
   * Function to process the API response for credential issuer JWKS.
   */
  processApiResponse: ProcessApiResponse<CredentialIssuerJwksResponse>;

  /**
   * Function to handle the credential issuer JWKS request.
   */
  handle: Handle<CredentialIssuerJwksRequest>;

  /**
   * Function to convert an HTTP request to a CredentialIssuerJwksRequest.
   */
  toApiRequest: ToApiRequest<CredentialIssuerJwksRequest>;

  /**
   * Function to process incoming HTTP requests to the credential issuer JWKS endpoint.
   */
  processRequest: ProcessRequest;
}
