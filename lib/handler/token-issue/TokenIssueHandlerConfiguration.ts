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
} from 'au3te-ts-common/schemas.token-issue';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { Handle } from '../handle';
import { Headers } from '../../utils/responseFactory';

/**
 * Configuration interface for the Token Issue handler.
 */
export interface TokenIssueHandlerConfiguration {
  /**
   * The path for the token endpoint.
   */
  path: string;

  /**
   * Function to process the API request for token issuance.
   */
  processApiRequest: ProcessApiRequest<TokenIssueRequest, TokenIssueResponse>;

  /**
   * Function to process the API response for token issuance.
   */
  processApiResponse: ProcessApiResponse<TokenIssueResponse, Headers>;

  /**
   * Function to handle the token issuance request.
   */
  handle: Handle<TokenIssueRequest, Headers>;
}
