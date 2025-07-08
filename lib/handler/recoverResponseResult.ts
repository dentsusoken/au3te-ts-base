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
import * as responseFactory from '../utils/responseFactory';
import { BadRequestError, ProcessError } from '@vecrea/au3te-ts-common/handler';

export type RecoverResponseResult = (
  path: string,
  responseResult: Result<Response>
) => Promise<Response>;

export const createRecoverResponseResult =
  (processError: ProcessError): RecoverResponseResult =>
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
