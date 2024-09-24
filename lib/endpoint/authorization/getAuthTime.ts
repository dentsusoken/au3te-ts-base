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
 * Represents a function that retrieves the time when the user was last authenticated.
 *
 * @returns {Promise<number>} A promise that resolves to the authentication time in seconds since the Unix epoch, or 0 if not available.
 */
export type GetAuthTime = () => Promise<number>;

/**
 * Creates a function to retrieve the time when the user was last authenticated.
 *
 * This function uses the provided session to fetch the 'authTime' value, which represents
 * the time of the last user authentication in seconds since the Unix epoch.
 * If the 'authTime' is not available or an error occurs, it returns 0.
 *
 * @param {BaseSession} session - The session object used to retrieve the authentication time.
 * @returns {GetAuthTime} A function that when called, retrieves the user's last authentication time.
 */
export const createGetAuthTime =
  (session: BaseSession): GetAuthTime =>
  async () => {
    const authTime = await session.get('authTime');

    return authTime ?? 0;
  };
