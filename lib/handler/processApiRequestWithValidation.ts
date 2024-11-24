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

import { ProcessApiRequest } from './processApiRequest';
import { ValidateApiResponse } from './validateApiResponse';

/**
 * Type alias for a function that processes an API request with validation.
 * This type extends ProcessApiRequest to include response validation.
 *
 * @template REQ - The type of the API request object
 * @template RES - The type of the API response
 * @template T - The type of additional options
 */
export type ProcessApiRequestWithValidation<
  REQ extends object,
  RES,
  T = unknown
> = (apiRequest: REQ, options?: T) => Promise<RES>;

/**
 * Parameters for creating a process API request function with validation.
 *
 * @template REQ - The type of the API request object
 * @template RES - The type of the API response
 * @template T - The type of additional options
 */
type CreateProcessApiRequestWithValidationParams<
  REQ extends object,
  RES,
  T = unknown
> = {
  /** Function to process the API request */
  processApiRequest: ProcessApiRequest<REQ, RES>;
  /** Function to validate the API response */
  validateApiResponse: ValidateApiResponse<RES, T>;
};

/**
 * Creates a function that processes an API request and validates its response.
 *
 * @template REQ - The type of the API request object
 * @template RES - The type of the API response
 * @template T - The type of additional options
 * @param params - Configuration parameters
 * @returns A function that processes the request and validates the response
 */
export const createProcessApiRequestWithValidation = <
  REQ extends object,
  RES,
  T = unknown
>({
  processApiRequest,
  validateApiResponse,
}: CreateProcessApiRequestWithValidationParams<
  REQ,
  RES,
  T
>): ProcessApiRequestWithValidation<REQ, RES, T> => {
  return async (apiRequest: REQ, options?: T) => {
    const apiResponse = await processApiRequest(apiRequest);
    await validateApiResponse(apiResponse, options);
    return apiResponse;
  };
};
