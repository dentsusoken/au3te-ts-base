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

import { Result } from '@vecrea/oid4vc-core/utils';
import { toErrorJson } from '@vecrea/au3te-ts-common/utils';
import { ResponseError } from './ResponseError';
import { BadRequestError, ProcessError } from '@vecrea/au3te-ts-common/handler';
import { ResponseFactory } from './responseFactory';

/**
 * Type definition for a function that recovers from response errors.
 * @param {string} path - The API endpoint path where the error occurred.
 * @param {Result<Response>} responseResult - The result object containing the response or error.
 * @returns {Promise<Response>} A promise that resolves to a recovered response.
 */
export type RecoverResponseResult = (
  path: string,
  responseResult: Result<Response>
) => Promise<Response>;

/**
 * Parameters required to create a recover response result function.
 * @typedef {Object} CreateRecoverResponseResultParams
 * @property {ProcessError} processError - Function to process the error.
 * @property {ResponseFactory} responseFactory - Factory to create response objects.
 */
type CreateRecoverResponseResultParams = {
  processError: ProcessError;
  responseFactory: ResponseFactory;
};

/**
 * Creates a function to recover from response errors.
 * @param {CreateRecoverResponseResultParams} params - Parameters for creating the recover response result function.
 * @returns {RecoverResponseResult} A function that recovers from response errors.
 */
export const createRecoverResponseResult =
  ({
    processError,
    responseFactory,
  }: CreateRecoverResponseResultParams): RecoverResponseResult =>
  async (path, responseResult): Promise<Response> => {
    const mayBeRecoveredResult = await responseResult.recoverAsync(
      async (error) => {
        await processError(path, error);

        if (error instanceof ResponseError) {
          return error.response;
        }

        if (error instanceof BadRequestError) {
          return responseFactory.badRequest(error.message);
        }

        return responseFactory.internalServerError(
          toErrorJson('internal_server_error', error.message)
        );
      }
    );

    return mayBeRecoveredResult.getOrElse((e) =>
      responseFactory.internalServerError(e.message)
    );
  };
