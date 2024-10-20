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
  AuthorizationFailReason,
  AuthorizationFailRequest,
} from 'au3te-ts-common/schemas.authorization-fail';
import { AuthorizationFailHandler } from '../authorization-fail/AuthorizationFailHandler';
import { ResponseError } from '../ResponseError';

export type BuildAuthorizationFailError = (
  ticket: string,
  reason: AuthorizationFailReason
) => Promise<ResponseError>;

export const createBuildAuthorizationFailError = (
  handler: AuthorizationFailHandler
): BuildAuthorizationFailError => {
  return async (ticket: string, reason: AuthorizationFailReason) => {
    const apiRequest: AuthorizationFailRequest = {
      ticket,
      reason,
    };
    const response = await handler.handle(apiRequest);

    return new ResponseError(
      `Authorization failed: ticket ${ticket}, reason ${reason}`,
      response
    );
  };
};
