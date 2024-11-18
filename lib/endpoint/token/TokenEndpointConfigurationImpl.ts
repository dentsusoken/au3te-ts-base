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

import { TokenRequest } from 'au3te-ts-common/schemas.token';
import { BaseHandlerConfiguration } from '../../handler/BaseHandlerConfiguration';
import { TokenHandlerConfigurationImpl } from '../../handler/token';
import { SessionSchemas } from '../../session/types';
import { sessionSchemas } from '../../session/sessionSchemas';
import { createProcessRequest, ProcessRequest } from '../processRequest';
import { TokenEndpointConfiguration } from './TokenEndpointConfiguration';
import { createToApiRequest } from '../toClientAuthRequest';
import { ToApiRequest } from '../toApiRequest';
import { ExtractorConfiguration } from '../../extractor/ExtractorConfiguration';
import { UserConfiguration } from 'au3te-ts-common/user';
import { TokenFailHandlerConfiguration } from '../../handler/token-fail/TokenFailHandlerConfiguration';
import { TokenIssueHandlerConfiguration } from '../../handler/token-issue/TokenIssueHandlerConfiguration';
import { TokenCreateHandlerConfiguration } from '../../handler/token-create/TokenCreateHandlerConfiguration';

type TokenEndpointConfigurationImplConstructorParams<
  SS extends SessionSchemas
> = {
  baseHandlerConfiguration: BaseHandlerConfiguration<SS>;
  extractorConfiguration: ExtractorConfiguration;
  userConfiguration: UserConfiguration;
  tokenFailHandlerConfiguration: TokenFailHandlerConfiguration;
  tokenIssueHandlerConfiguration: TokenIssueHandlerConfiguration;
  tokenCreateHandlerConfiguration: TokenCreateHandlerConfiguration;
};

/**
 * Implementation of the Token endpoint configuration.
 * Handles conversion of HTTP requests to Token API requests and processes them.
 *
 * @template SS - Type of session schemas, defaults to the standard session schemas
 * @implements {TokenEndpointConfiguration}
 */
export class TokenEndpointConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements TokenEndpointConfiguration
{
  /** Function to convert HTTP requests to Token API requests */
  toApiRequest: ToApiRequest<TokenRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates a new Token endpoint configuration instance.
   *
   * @param baseHandlerConfiguration - Base configuration for request handling
   * @param extractorConfiguration - Configuration for extracting data from requests
   * @param userConfiguration - Configuration for user handling
   * @param tokenFailHandlerConfiguration - Configuration for token fail handling
   * @param tokenIssueHandlerConfiguration - Configuration for token issue handling
   * @param tokenCreateHandlerConfiguration - Configuration for token create handling
   */
  constructor({
    baseHandlerConfiguration,
    extractorConfiguration,
    userConfiguration,
    tokenFailHandlerConfiguration,
    tokenIssueHandlerConfiguration,
    tokenCreateHandlerConfiguration,
  }: TokenEndpointConfigurationImplConstructorParams<SS>) {
    this.toApiRequest = createToApiRequest({
      extractParameters: extractorConfiguration.extractParameters,
      extractClientCredentials: extractorConfiguration.extractClientCredentials,
      extractClientCertificateAndPath:
        extractorConfiguration.extractClientCertificateAndPath,
    });

    const tokenHandlerConfiguration = new TokenHandlerConfigurationImpl({
      baseHandlerConfiguration,
      userConfiguration,
      tokenFailHandlerConfiguration,
      tokenIssueHandlerConfiguration,
      tokenCreateHandlerConfiguration,
    });

    this.processRequest = createProcessRequest({
      path: tokenHandlerConfiguration.path,
      toApiRequest: this.toApiRequest,
      handle: tokenHandlerConfiguration.handle,
      recoverResponseResult: baseHandlerConfiguration.recoverResponseResult,
    });
  }
}
