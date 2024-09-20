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
import { runAsyncCatching } from 'au3te-ts-common/utils';

/**
 * Represents a function that retrieves the subject (unique identifier) of the authenticated user.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the user's subject as a string,
 * or undefined if the user is not authenticated or the subject is not available.
 */
export type GetUserSubject = () => Promise<string | undefined>;

/**
 * Creates a function to retrieve the subject of the authenticated user from the session.
 *
 * This function uses the provided session to fetch the 'user' object and extract its 'subject' property.
 * The subject typically represents a unique identifier for the user, often used as the 'sub' claim in ID tokens.
 * If the user is not authenticated or an error occurs during retrieval, it returns undefined.
 *
 * @param {BaseSession} session - The session object used to retrieve the user information.
 * @returns {GetUserSubject} A function that when called, retrieves the user's subject.
 */
export const createGetUserSubject =
  (session: BaseSession): GetUserSubject =>
  async () => {
    const result = await runAsyncCatching(async () => {
      const user = await session.get('user');

      return user?.subject;
    });

    return result.getOrDefault(undefined);
  };
