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
import { ProcessApiRequest } from './processApiRequest';
import { ProcessApiResponse } from './processApiResponse';
import { AuthorizationFailRequest } from 'au3te-ts-common/schemas.authorization.fail';
import { RecoverResponseResult } from '../recoverResponseResult';

export type Post = (apiRequest: AuthorizationFailRequest) => Promise<Response>;

export type CreatePostParams = {
  processApiRequest: ProcessApiRequest;
  processApiResponse: ProcessApiResponse;
  recoverResponseResult: RecoverResponseResult;
};

export const createPost =
  ({
    processApiRequest,
    processApiResponse,
    recoverResponseResult,
  }: CreatePostParams): Post =>
  async (apiRequest: AuthorizationFailRequest): Promise<Response> => {
    const responseResult = await runAsyncCatching(async () => {
      const apiResponse = await processApiRequest(apiRequest);

      return processApiResponse(apiResponse);
    });

    return await recoverResponseResult(responseResult);
  };
