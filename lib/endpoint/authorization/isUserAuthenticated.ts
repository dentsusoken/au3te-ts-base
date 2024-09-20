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
import { BaseSession } from '../../session/BaseSession';

/**
 * Represents a function that checks if a user is authenticated.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if the user is authenticated, false otherwise.
 */
export type IsUserAuthenticated = () => Promise<boolean>;

/**
 * Creates a function to check if a user is authenticated based on the provided session.
 *
 * This function uses the session to retrieve the user information and determines
 * if the user is authenticated based on the presence of user data in the session.
 * It handles potential errors during the session access and defaults to false
 * if an error occurs.
 *
 * @param {BaseSession} session - The session object used to retrieve user information.
 * @returns {IsUserAuthenticated} A function that when called, checks if the user is authenticated.
 */
export const createIsUserAuthenticated =
  (session: BaseSession): IsUserAuthenticated =>
  async () => {
    const result = await runAsyncCatching(async () => {
      const user = await session.get('user');

      return user != null;
    });

    return result.getOrDefault(false);
  };
