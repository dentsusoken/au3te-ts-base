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

import { runAsyncCatching } from 'oid4vc-core/utils';
import { ToApiRequest } from './toApiRequest';
import { Handle } from './handle';
import { RecoverResponseResult } from './recoverResponseResult';

export type ProcessRequest = (request: Request) => Promise<Response>;

type CreateProcessRequestParams<REQ extends object> = {
  path: string;
  toApiRequest: ToApiRequest<REQ>;
  handle: Handle<REQ>;
  recoverResponseResult: RecoverResponseResult;
};

export const createProcessRequest =
  <REQ extends object>({
    path,
    toApiRequest,
    handle,
    recoverResponseResult,
  }: CreateProcessRequestParams<REQ>): ProcessRequest =>
  async (request) => {
    const responseResult = await runAsyncCatching(async () => {
      const apiRequest = await toApiRequest(request);

      return handle(apiRequest);
    });

    return await recoverResponseResult(path, responseResult);
  };
