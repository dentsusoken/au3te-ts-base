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

import { Result } from 'oid4vc-core/utils';
import { ResponseError } from './ResponseError';
import * as responseFactory from '../utils/responseFactory';
import { ProcessError } from 'au3te-ts-common/handler';

/**
 * A function type that recovers from a Result<Response> and returns a Promise<Response>.
 *
 * @typedef {Function} RecoverResponseResult
 * @param {Result<Response>} responseResult - The Result object containing either a successful Response or an error.
 * @returns {Promise<Response>} A promise that resolves to a Response, either the original one or an error response.
 */
export type RecoverResponseResult = (
  responseResult: Result<Response>
) => Promise<Response>;

/**
 * Creates a function to recover from potential errors in a Result<Response>.
 *
 * This function handles both successful responses and errors. If an error occurs,
 * it attempts to process the error and create an appropriate error response.
 *
 * @param {ProcessError} processError - A function to process errors and generate error messages.
 * @returns {RecoverResponseResult} A function that takes a Result<Response> and returns a Promise<Response>.
 *
 * @example
 * const recoverResponse = createRecoverResponseResult(myErrorProcessor);
 * const result = await someOperation();
 * const response = await recoverResponse(result);
 */
export const createRecoverResponseResult =
  (processError: ProcessError): RecoverResponseResult =>
  async (responseResult: Result<Response>): Promise<Response> => {
    const mayBeRecoveredResult = await responseResult.recoverAsync(
      async (e) => {
        await processError(e);

        if (e instanceof ResponseError) {
          return e.response;
        }

        return responseFactory.internalServerError(e.message);
      }
    );

    return mayBeRecoveredResult.getOrElse((e) =>
      responseFactory.internalServerError(e.message)
    );
  };
