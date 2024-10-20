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

import { BaseSession } from '../../session/BaseSession';

/**
 * Represents a function that clears the current user information from the session.
 *
 * @param {BaseSession} session - The session object containing user information
 * @returns {Promise<void>} A promise that resolves when the operation is complete
 */
export type ClearCurrentUserInfoInSession = (
  session: BaseSession
) => Promise<void>;

/**
 * Default implementation of the function to clear current user information from the session.
 * This function removes both the 'user' and 'authTime' entries from the session.
 *
 * @param {BaseSession} session - The session object containing user information
 * @returns {Promise<void>} A promise that resolves when the operation is complete
 */
export const defaultClearCurrentUserInfoInSession: ClearCurrentUserInfoInSession =
  async (session: BaseSession) => {
    await session.deleteBatch('user', 'authTime');
  };
