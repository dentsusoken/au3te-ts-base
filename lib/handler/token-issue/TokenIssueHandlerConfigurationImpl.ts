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
  TokenIssueRequest,
  TokenIssueResponse,
  tokenIssueResponseSchema,
} from '@vecrea/au3te-ts-common/schemas.token-issue';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import { Handle, createHandle } from '../handle';
import { SessionSchemas } from '../../session/types';
import { createProcessApiRequest } from '../processApiRequest';
import { ServerHandlerConfiguration } from '../ServerHandlerConfiguration';
import { TokenIssueHandlerConfiguration } from './TokenIssueHandlerConfiguration';
import { Headers } from '../../utils/responseFactory';

/**
 * Implementation of the TokenIssueHandlerConfiguration interface.
 * This class configures and handles Token Issue requests.
 */
export class TokenIssueHandlerConfigurationImpl
  implements TokenIssueHandlerConfiguration
{
  /** The path for the token issue endpoint. */
  path: string = '/api/token/issue';

  /** Function to process the API request for token issuance. */
  processApiRequest: ProcessApiRequest<TokenIssueRequest, TokenIssueResponse>;

  /** Function to process the API response for token issuance. */
  processApiResponse: ProcessApiResponse<TokenIssueResponse, Headers>;

  /** Function to handle the token issuance request. */
  handle: Handle<TokenIssueRequest, Headers>;

  /**
   * Creates an instance of TokenIssueHandlerConfigurationImpl.
   * @param {ServerHandlerConfiguration<SessionSchemas>} serverHandlerConfiguration - The server handler configuration.
   */
  constructor(
    serverHandlerConfiguration: ServerHandlerConfiguration<SessionSchemas>
  ) {
    const { apiClient, buildUnknownActionMessage, recoverResponseResult } =
      serverHandlerConfiguration;

    this.processApiRequest = createProcessApiRequest(
      apiClient.tokenIssuePath,
      tokenIssueResponseSchema,
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
