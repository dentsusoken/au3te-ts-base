/*
 * Copyright (C) 2019-2024 Authlete, Inc.
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

import { BuildUnknownActionMessage } from '@vecrea/au3te-ts-common/handler';
import { ResponseFactory } from './responseFactory';
import { ResponseErrorFactory } from './responseErrorFactory';

/**
 * Defines a function type for processing an API response and returning a Response object.
 * @template RES - The type representing the API response.
 * @template T - The type representing optional parameters.
 * @param {RES} apiResponse - The API response that needs to be processed.
 * @param {T} [options] - Optional parameters that may be used during processing.
 * @returns {Promise<Response>} A Promise that resolves to a Response object after processing.
 */
export type ProcessApiResponse<RES, T = unknown> = (
  apiResponse: RES,
  options?: T
) => Promise<Response>;

/**
 * Describes the parameters required to create a function for processing API responses.
 */
export type CreateProcessApiResponseParams = {
  /** The API endpoint path. */
  path: string;
  /** A function to construct a message for unknown actions. */
  buildUnknownActionMessage: BuildUnknownActionMessage;

  /**
   * A factory for generating HTTP responses.
   */
  responseFactory: ResponseFactory;

  /**
   * A factory for generating response errors.
   */
  responseErrorFactory: ResponseErrorFactory;
};
