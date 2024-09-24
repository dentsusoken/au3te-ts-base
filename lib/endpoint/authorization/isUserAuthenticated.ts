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
 * Represents a function that checks if a user is authenticated.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if the user is authenticated, false otherwise.
 */
export type IsUserAuthenticated = () => Promise<boolean>;

/**
 * Creates a function to check if a user is currently authenticated.
 *
 * This function uses the provided session to retrieve the user information.
 * If the user exists in the session, it is considered that the user is authenticated.
 *
 * @param {BaseSession} session - The session object used to retrieve user information.
 * @returns {IsUserAuthenticated} A function that when called, checks if the user is authenticated.
 *                                Returns a promise that resolves to true if the user is authenticated, false otherwise.
 */
export const createIsUserAuthenticated =
  (session: BaseSession): IsUserAuthenticated =>
  async () => {
    const user = await session.get('user');

    return user != null;
  };
