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
  TokenFailReason,
  TokenFailRequest,
} from '@vecrea/au3te-ts-common/schemas.token-fail';
import { Handle } from '../handle';
import { ResponseError } from '../ResponseError';
import { Headers } from '../responseFactory';

/**
 * Type definition for a function that builds a token fail error.
 * @param {string} ticket - The ticket associated with the token request
 * @param {TokenFailReason} reason - The reason for the token failure
 * @param {Headers} headers - The HTTP headers to include in the response
 * @returns {Promise<ResponseError>} A promise that resolves to a ResponseError
 */
export type BuildTokenFailError = (
  ticket: string,
  reason: TokenFailReason,
  headers: Headers
) => Promise<ResponseError>;

/**
 * Creates a function to build a token fail error.
 * @param {Handle<TokenFailRequest, Headers>} handle - The function to handle the token fail request
 * @returns {BuildTokenFailError} A function that builds a token fail error
 */
export const createBuildTokenFailError = (
  handle: Handle<TokenFailRequest, Headers>
): BuildTokenFailError => {
  /**
   * Builds a token fail error.
   * @param {string} ticket - The ticket associated with the token request
   * @param {TokenFailReason} reason - The reason for the token failure
   * @param {Headers} headers - The HTTP headers to include in the response
   * @returns {Promise<ResponseError>} A promise that resolves to a ResponseError
   */
  return async (ticket: string, reason: TokenFailReason, headers: Headers) => {
    const apiRequest: TokenFailRequest = {
      ticket,
      reason,
    };
    const response = await handle(apiRequest, headers);

    return new ResponseError(
      `Token request failed: ticket ${ticket}, reason ${reason}`,
      response
    );
  };
};
