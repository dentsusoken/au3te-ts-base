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

import { runAsyncCatching } from 'au3te-ts-common/utils';
import { ProcessError } from 'au3te-ts-common/endpoint';
import { ToApiRequest } from './toApiRequest';
import { ProcessApiRequest } from './processApiRequest';
import { ProcessApiResponse } from './processApiResponse';
import * as responseFactory from '../../utils/responseFactory';

export type Post = (request: Request) => Promise<Response>;

export type CreatePostParams = {
  toApiRequest: ToApiRequest;
  processApiRequest: ProcessApiRequest;
  processApiResponse: ProcessApiResponse;
  processError: ProcessError;
};

export const createPost =
  ({
    toApiRequest,
    processApiRequest,
    processApiResponse,
    processError,
  }: CreatePostParams): Post =>
  async (request: Request): Promise<Response> => {
    const responseResult = await runAsyncCatching(async () => {
      const apiRequest = await toApiRequest(request);
      const apiResponse = await processApiRequest(apiRequest);

      return processApiResponse(apiResponse);
    });

    const mayBeRecoveredResult = await responseResult.recoverAsync(
      async (e) => {
        const message = await processError(e);

        return responseFactory.internalServerError(message);
      }
    );

    return mayBeRecoveredResult.getOrElse((e) =>
      responseFactory.internalServerError(e.message)
    );
  };
