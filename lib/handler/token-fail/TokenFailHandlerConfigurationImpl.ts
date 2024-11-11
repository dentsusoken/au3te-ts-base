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
  TokenFailRequest,
  TokenFailResponse,
  tokenFailResponseSchema,
} from 'au3te-ts-common/schemas.token-fail';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { createProcessApiRequest } from '../processApiRequest';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { TokenFailHandlerConfiguration } from './TokenFailHandlerConfiguration';
import { Headers } from '../../utils/responseFactory';

/**
 * Implementation of the TokenFailHandlerConfiguration interface.
 * This class configures and handles Token Fail requests.
 */
export class TokenFailHandlerConfigurationImpl
  implements TokenFailHandlerConfiguration
{
  /** The path for the token fail endpoint. */
  path: string = '/api/token/fail';

  /** Function to process the API request for token fail. */
  processApiRequest: ProcessApiRequest<TokenFailRequest, TokenFailResponse>;

  /** Function to process the API response for token fail. */
  processApiResponse: ProcessApiResponse<TokenFailResponse, Headers>;

  /** Function to handle the token fail request. */
  handle: Handle<TokenFailRequest, Headers>;

  /**
   * Creates an instance of TokenFailHandlerConfigurationImpl.
   * @param {BaseHandlerConfiguration<SessionSchemas>} baseHandlerConfiguration - The base handler configuration.
   */
  constructor(
    baseHandlerConfiguration: BaseHandlerConfiguration<SessionSchemas>
  ) {
    const { apiClient, buildUnknownActionMessage, recoverResponseResult } =
      baseHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.tokenFailPath,
      tokenFailResponseSchema,
      apiClient
    );

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
