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

import { AuthorizationRequest } from 'au3te-ts-common/schemas.authorization';
import { ProcessRequest } from '../processRequest';
import { ToApiRequest } from '../../handler/toApiRequest';

/**
 * Interface defining the configuration for the Authorization endpoint.
 * This endpoint handles OAuth 2.0 and OpenID Connect authorization requests,
 * which are used to obtain authorization from the resource owner.
 */
export interface AuthorizationEndpointConfiguration {
  /**
   * Function to convert an HTTP request to an AuthorizationRequest.
   */
  toApiRequest: ToApiRequest<AuthorizationRequest>;

  /**
   * Function to process incoming HTTP requests to the authorization endpoint.
   * Takes a Request object and returns a Promise resolving to a Response.
   */
  processRequest: ProcessRequest;
}
