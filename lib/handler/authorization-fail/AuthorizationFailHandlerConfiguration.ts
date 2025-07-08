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
  AuthorizationFailRequest,
  AuthorizationFailResponse,
} from '@vecrea/au3te-ts-common/schemas.authorization-fail';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { Handle } from '../handle';
import { BuildAuthorizationFailError } from './buildAuthorizationFailError';

/**
 * Configuration interface for the Authorization Fail handler.
 */
export interface AuthorizationFailHandlerConfiguration {
  /**
   * The path for the authorization fail endpoint.
   */
  path: string;

  /**
   * Function to process the API request for authorization fail.
   */
  processApiRequest: ProcessApiRequest<
    AuthorizationFailRequest,
    AuthorizationFailResponse
  >;

  /**
   * Function to process the API response for authorization fail.
   */
  processApiResponse: ProcessApiResponse<AuthorizationFailResponse>;

  /**
   * Function to handle the authorization fail request.
   */
  handle: Handle<AuthorizationFailRequest>;

  /**
   * Function to build an error response for authorization fail.
   */
  buildAuthorizationFailError: BuildAuthorizationFailError;
}
