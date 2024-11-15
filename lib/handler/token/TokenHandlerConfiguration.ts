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

import { TokenRequest, TokenResponse } from 'au3te-ts-common/schemas.token';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { Handle } from '../handle';
import { DetermineSubject } from './determineSubject';
import { HandlePassword } from './handlePassword';
import { HandleTokenCreate } from './handleTokenCreate';
import { ResponseToCreateRequest } from './responseToCreateRequest';

/**
 * Configuration interface for the Token endpoint handler.
 */
export interface TokenHandlerConfiguration {
  /**
   * The path for the token endpoint.
   */
  path: string;

  /**
   * Function to determine the subject identifier from a token exchange response.
   * Implements RFC 8693 OAuth 2.0 Token Exchange.
   */
  determineSubject4TokenExchange: DetermineSubject;

  /**
   * Function to determine the subject identifier from a JWT Bearer token response.
   * Implements RFC 7523 JWT Profile for OAuth 2.0 Client Authentication and Authorization Grants.
   */
  determineSubject4JwtBearer: DetermineSubject;

  /**
   * Handler for Resource Owner Password Credentials grant type requests.
   * Processes username/password authentication and token issuance.
   */
  handlePassword: HandlePassword;

  /**
   * Handler for Token Exchange requests (RFC 8693).
   * Processes token exchange operations and creates new tokens.
   */
  handleTokenExchange: HandleTokenCreate;

  /**
   * Handler for JWT Bearer Token requests (RFC 7523).
   * Processes JWT Bearer assertions and creates tokens.
   */
  handleJwtBearer: HandleTokenCreate;

  /**
   * Function to convert token exchange responses to token creation requests.
   * Used in the token exchange flow to prepare requests for new token creation.
   */
  responseToCreateRequest4TokenExchange: ResponseToCreateRequest;

  /**
   * Function to convert JWT Bearer responses to token creation requests.
   * Used in the JWT Bearer flow to prepare requests for new token creation.
   */
  responseToCreateRequest4JwtBearer: ResponseToCreateRequest;

  /**
   * Function to process the API request for token operations.
   */
  processApiRequest: ProcessApiRequest<TokenRequest, TokenResponse>;

  /**
   * Function to process the API response for token operations.
   */
  processApiResponse: ProcessApiResponse<TokenResponse>;

  /**
   * Function to handle the token request.
   */
  handle: Handle<TokenRequest>;
}
