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
import { BaseSession } from '../../session/BaseSession';

/**
 * Represents a function that clears the current user information from the session if necessary.
 *
 * @param {AuthorizationResponse} response - The authorization response object.
 * @param {BaseSession} session - The session object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export type ClearCurrentUserInfoInSessionIfNecessary = (
  response: AuthorizationResponse,
  session: BaseSession
) => Promise<void>;

/**
 * Parameters for creating a ClearCurrentUserInfoInSessionIfNecessary function.
 */
type CreateClearCurrentUserInfoInSessionIfNecessaryParams = {
  checkPrompts: CheckPrompts;
  checkAuthAge: CheckAuthAge;
  clearCurrentUserInfoInSession: ClearCurrentUserInfoInSession;
};

/**
 * Creates a function to clear current user information from the session if necessary.
 *
 * @param {CreateClearCurrentUserInfoInSessionIfNecessaryParams} params - The parameters for creating the function.
 * @returns {ClearCurrentUserInfoInSessionIfNecessary} A function that clears current user information if necessary.
 */
export const createClearCurrentUserInfoInSessionIfNecessary =
  ({
    checkPrompts,
    checkAuthAge,
    clearCurrentUserInfoInSession,
  }: CreateClearCurrentUserInfoInSessionIfNecessaryParams): ClearCurrentUserInfoInSessionIfNecessary =>
  async (response, session) => {
    const authTime = (await session.get('authTime')) ?? 0;
    const shouldClearCurrentUserInfoInSession =
      checkPrompts(response.prompts) || checkAuthAge(authTime, response.maxAge);

    if (shouldClearCurrentUserInfoInSession) {
      await clearCurrentUserInfoInSession(session);
    }
  };
