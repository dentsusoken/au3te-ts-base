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
  TokenRequest,
  TokenResponse,
  tokenResponseSchema,
} from 'au3te-ts-common/schemas.token';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { TokenHandlerConfiguration } from './TokenHandlerConfiguration';
import { createHandlePassword } from './handlePassword';
import { createHandleTokenCreate } from './handleTokenCreate';
import { createResponseToCreateRequest } from './responseToCreateRequest';
import { defaultDetermineSubject4TokenExchange } from './determineSubject4TokenExchange';
import { defaultDetermineSubject4JwtBearer } from './determineSubject4JwtBearer';
import { DetermineSubject } from './determineSubject';
import { HandlePassword } from './handlePassword';
import { HandleTokenCreate } from './handleTokenCreate';
import { ResponseToCreateRequest } from './responseToCreateRequest';
import { UserConfiguration } from 'au3te-ts-common/user';
import { TokenFailHandlerConfiguration } from '../token-fail/TokenFailHandlerConfiguration';
import { TokenIssueHandlerConfiguration } from '../token-issue/TokenIssueHandlerConfiguration';
import { TokenCreateHandlerConfiguration } from '../token-create/TokenCreateHandlerConfiguration';

/**
 * Configuration parameters for TokenHandlerConfigurationImpl constructor.
 * Provides all necessary configurations for handling token endpoint operations.
 */
type TokenHandlerConfigurationImplConstructorParams = {
  /** Base configuration for common handler operations */
  baseHandlerConfiguration: BaseHandlerConfiguration<SessionSchemas>;

  /** Configuration for user authentication and management */
  userConfiguration: UserConfiguration;

  /** Configuration for handling token operation failures */
  tokenFailHandlerConfiguration: TokenFailHandlerConfiguration;

  /** Configuration for token issuance operations */
  tokenIssueHandlerConfiguration: TokenIssueHandlerConfiguration;

  /** Configuration for token creation operations */
  tokenCreateHandlerConfiguration: TokenCreateHandlerConfiguration;
};

/**
 * Implementation of the TokenHandlerConfiguration interface.
 *
 * This class configures and handles Token endpoint requests, supporting:
 * - Resource Owner Password Credentials grant
 * - Token Exchange (RFC 8693)
 * - JWT Bearer Token (RFC 7523)
 *
 * It coordinates between different token-related operations:
 * - User authentication
 * - Token creation
 * - Token issuance
 * - Error handling
 */
export class TokenHandlerConfigurationImpl
  implements TokenHandlerConfiguration
{
  /** The path for the token endpoint. */
  path: string = '/api/token';

  /** Function to determine subject from token exchange response */
  determineSubject4TokenExchange: DetermineSubject;

  /** Function to determine subject from JWT Bearer token response */
  determineSubject4JwtBearer: DetermineSubject;

  /** Handler for password grant type requests */
  handlePassword: HandlePassword;

  /** Handler for token exchange requests */
  handleTokenExchange: HandleTokenCreate;

  /** Handler for JWT Bearer token requests */
  handleJwtBearer: HandleTokenCreate;

  /** Function to convert token exchange responses to creation requests */
  responseToCreateRequest4TokenExchange: ResponseToCreateRequest;

  /** Function to convert JWT Bearer responses to creation requests */
  responseToCreateRequest4JwtBearer: ResponseToCreateRequest;

  /** Function to process the API request for token operations */
  processApiRequest: ProcessApiRequest<TokenRequest, TokenResponse>;

  /** Function to process the API response for token operations */
  processApiResponse: ProcessApiResponse<TokenResponse>;

  /** Function to handle the token request */
  handle: Handle<TokenRequest>;

  /**
   * Creates an instance of TokenHandlerConfigurationImpl.
   * @param {TokenHandlerConfigurationImplConstructorParams} params - Configuration parameters
   */
  constructor({
    baseHandlerConfiguration,
    userConfiguration,
    tokenFailHandlerConfiguration,
    tokenIssueHandlerConfiguration,
    tokenCreateHandlerConfiguration,
  }: TokenHandlerConfigurationImplConstructorParams) {
    const {
      apiClient,
      buildUnknownActionMessage,
      recoverResponseResult,
      prepareHeaders,
    } = baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.tokenPath,
      tokenResponseSchema,
      apiClient
    );

    // Initialize subject determination functions
    this.determineSubject4TokenExchange = defaultDetermineSubject4TokenExchange;
    this.determineSubject4JwtBearer = defaultDetermineSubject4JwtBearer;

    // Initialize response to request conversion functions
    this.responseToCreateRequest4TokenExchange = createResponseToCreateRequest({
      grantType: 'urn:ietf:params:oauth:grant-type:token-exchange',
      determineSubject: this.determineSubject4TokenExchange,
    });

    this.responseToCreateRequest4JwtBearer = createResponseToCreateRequest({
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      determineSubject: this.determineSubject4JwtBearer,
    });

    // Create handlers using the initialized functions
    this.handlePassword = createHandlePassword({
      getByCredentials: userConfiguration.getByCredentials,
      handle4TokenIssue: tokenIssueHandlerConfiguration.handle,
      buildTokenFailError: tokenFailHandlerConfiguration.buildTokenFailError,
    });

    this.handleTokenExchange = createHandleTokenCreate({
      responseToCreateRequest: this.responseToCreateRequest4TokenExchange,
      handle4TokenCreate: tokenCreateHandlerConfiguration.handle,
    });

    this.handleJwtBearer = createHandleTokenCreate({
      responseToCreateRequest: this.responseToCreateRequest4JwtBearer,
      handle4TokenCreate: tokenCreateHandlerConfiguration.handle,
    });

    this.processApiResponse = createProcessApiResponse({
      path: this.path,
      buildUnknownActionMessage,
      prepareHeaders,
      handlePassword: this.handlePassword,
      handleTokenExchange: this.handleTokenExchange,
      handleJwtBearer: this.handleJwtBearer,
    });

    this.handle = createHandle({
      path: this.path,
      processApiRequest: this.processApiRequest,
      processApiResponse: this.processApiResponse,
      recoverResponseResult,
    });
  }
}