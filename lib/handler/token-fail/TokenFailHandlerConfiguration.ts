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
} from '@vecrea/au3te-ts-common/schemas.token-fail';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { Handle } from '../handle';
import { Headers } from '../../utils/responseFactory';
import { BuildTokenFailError } from './buildTokenFailError';

/**
 * Configuration interface for the Token Fail handler.
 */
export interface TokenFailHandlerConfiguration {
  /**
   * The path for the token fail endpoint.
   */
  path: string;

  /**
   * Function to build a token fail error.
   */
  buildTokenFailError: BuildTokenFailError;

  /**
   * Function to process the API request for token fail.
   */
  processApiRequest: ProcessApiRequest<TokenFailRequest, TokenFailResponse>;

  /**
   * Function to process the API response for token fail.
   */
  processApiResponse: ProcessApiResponse<TokenFailResponse, Headers>;

  /**
   * Function to handle the token fail request.
   */
  handle: Handle<TokenFailRequest, Headers>;
}
