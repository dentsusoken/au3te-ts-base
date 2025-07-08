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

import { runAsyncCatching } from '@vecrea/oid4vc-core/utils';
import { ToApiRequest } from './toApiRequest';
import { RecoverResponseResult } from './recoverResponseResult';
import { HandleWithOptions } from './handleWithOptions';
import { ApiRequestWithOptions } from './types';
import { ProcessRequest } from './processRequest';

type CreateProcessRequestWithOptionsParams<REQ extends object, OPTS> = {
  path: string;
  toApiRequest: ToApiRequest<ApiRequestWithOptions<REQ, OPTS>>;
  handle: HandleWithOptions<REQ, OPTS>;
  recoverResponseResult: RecoverResponseResult;
};

export const createProcessRequestWithOptions =
  <REQ extends object, OPTS>({
    path,
    toApiRequest,
    handle,
    recoverResponseResult,
  }: CreateProcessRequestWithOptionsParams<REQ, OPTS>): ProcessRequest =>
  async (request) => {
    const responseResult = await runAsyncCatching(async () => {
      const apiRequestWithOptions = await toApiRequest(request);

      return handle(apiRequestWithOptions);
    });

    return await recoverResponseResult(path, responseResult);
  };
