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
import { ProcessRequest } from '../processRequest';
import { ToApiRequest } from '../../handler/toApiRequest';

/**
 * Interface defining the configuration for the Token endpoint.
 * This endpoint handles OAuth 2.0 token requests, including access token issuance
 * and refresh token operations.
 */
export interface TokenEndpointConfiguration {
  /**
   * Function to convert an HTTP request to a TokenRequest.
   */
  toApiRequest: ToApiRequest<TokenRequest>;

  /**
   * Function to process incoming HTTP requests to the token endpoint.
   * Takes a Request object and returns a Promise resolving to a Response.
   */
  processRequest: ProcessRequest;
}
