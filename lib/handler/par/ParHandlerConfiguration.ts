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
  PushedAuthReqRequest,
  PushedAuthReqResponse,
} from '@vecrea/au3te-ts-common/schemas.par';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { Handle } from '../handle';
import { ToApiRequest } from '../toApiRequest';
import { ProcessRequest } from '../processRequest';

/**
 * Configuration interface for the Pushed Authorization Request (PAR) handler.
 */
export interface ParHandlerConfiguration {
  /**
   * The path for the PAR endpoint.
   */
  path: string;

  /**
   * Function to process the API request for PAR.
   */
  processApiRequest: ProcessApiRequest<
    PushedAuthReqRequest,
    PushedAuthReqResponse
  >;

  /**
   * Function to process the API response for PAR.
   */
  processApiResponse: ProcessApiResponse<PushedAuthReqResponse>;

  /**
   * Function to handle the PAR request.
   */
  handle: Handle<PushedAuthReqRequest>;

  /**
   * Function to convert an HTTP request to a PushedAuthReqRequest.
   */
  toApiRequest: ToApiRequest<PushedAuthReqRequest>;

  /**
   * Function to process incoming HTTP requests to the PAR endpoint.
   */
  processRequest: ProcessRequest;
}
