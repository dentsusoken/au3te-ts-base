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
 * Represents a function that clears the current user's information from the session.
 *
 * @returns {Promise<void>} A promise that resolves when the user information has been cleared.
 */
export type ClearCurrentUserInfoInSession = () => Promise<void>;

/**
 * Creates a function to clear the current user's information from the session.
 *
 * This function removes both the 'user' and 'authTime' entries from the session.
 * The 'user' typically contains the user's subject identifier and other user-related data.
 * The 'authTime' represents the time when the user authentication occurred.
 *
 * @param {BaseSession} session - The session object used to store user information.
 * @returns {ClearCurrentUserInfoInSession} A function that when called, clears the user information from the session.
 */
export const createClearCurrentUserInfoInSession =
  (session: BaseSession): ClearCurrentUserInfoInSession =>
  async () => {
    await session.deleteBatch('user', 'authTime');
  };
