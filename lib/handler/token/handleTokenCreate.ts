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

import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';
import { ResponseToCreateRequest } from './responseToCreateRequest';
import { Handle } from '../handle';
import { TokenCreateRequest } from '@vecrea/au3te-ts-common/schemas.token-create';
import { Headers } from '../responseFactory';

/**
 * Function type for handling token creation operations.
 * Processes a token response and returns an HTTP response.
 *
 * @param apiResponse - The token response from the authorization server
 * @param headers - HTTP headers to be included in the response
 * @returns A promise that resolves to an HTTP response
 */
export type HandleTokenCreate = (
  apiResponse: TokenResponse,
  headers: Headers
) => Promise<Response>;

/**
 * Configuration parameters for creating a token creation handler.
 */
type CreateHandleTokenCreateParams = {
  /** Function to convert token response to a token creation request */
  responseToCreateRequest: ResponseToCreateRequest;
  /** Handler for processing token creation requests with custom headers */
  handle4TokenCreate: Handle<TokenCreateRequest, Headers>;
};

/**
 * Creates a handler function for token creation operations.
 *
 * This function creates a handler that processes token responses by:
 * 1. Converting the token response to a token creation request
 * 2. Processing the creation request to generate an HTTP response with custom headers
 *
 * @param params - Configuration parameters for the handler
 * @param params.responseToCreateRequest - Function to convert responses to creation requests
 * @param params.handle4TokenCreate - Handler for processing token creation requests with headers
 * @returns A function that processes token responses and returns HTTP responses
 *
 * @example
 * ```typescript
 * const handleTokenCreate = createHandleTokenCreate({
 *   responseToCreateRequest: convertResponse,
 *   handle4TokenCreate: processCreation
 * });
 * const headers = { 'Custom-Header': 'value' };
 * const response = await handleTokenCreate(tokenResponse, headers);
 * ```
 */
export const createHandleTokenCreate = ({
  responseToCreateRequest,
  handle4TokenCreate,
}: CreateHandleTokenCreateParams): HandleTokenCreate => {
  return async (apiResponse: TokenResponse, headers: Headers) => {
    const request = await responseToCreateRequest(apiResponse);

    return handle4TokenCreate(request, headers);
  };
};
