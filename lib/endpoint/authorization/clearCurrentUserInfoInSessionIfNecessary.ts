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

import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';
import { CheckPrompts } from './checkPrompts';
import { CheckAuthAge } from './checkAuthAge';
import { ClearCurrentUserInfoInSession } from './clearCurrentUserInfoInSession';

export type ClearCurrentUserInfoInSessionIfNecessary = (
  response: AuthorizationResponse
) => Promise<void>;

type CreateClearCurrentUserInfoInSessionIfNecessaryParams = {
  checkPrompts: CheckPrompts;
  checkAuthAge: CheckAuthAge;
  clearCurrentUserInfoInSession: ClearCurrentUserInfoInSession;
};

export const createClearCurrentUserInfoInSessionIfNecessary =
  ({
    checkPrompts,
    checkAuthAge,
    clearCurrentUserInfoInSession,
  }: CreateClearCurrentUserInfoInSessionIfNecessaryParams): ClearCurrentUserInfoInSessionIfNecessary =>
  async (response) => {
    const shouldClearSession =
      checkPrompts(response) || (await checkAuthAge(response));

    if (shouldClearSession) {
      await clearCurrentUserInfoInSession();
    }
  };
