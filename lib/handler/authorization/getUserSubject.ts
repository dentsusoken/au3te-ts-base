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
 * Represents a function that retrieves the subject (unique identifier) of the authenticated user.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the user's subject as a string,
 * or undefined if the user is not authenticated or the subject is not available.
 */
export type GetUserSubject = () => Promise<string | undefined>;

export const createGetUserSubject =
  (session: BaseSession): GetUserSubject =>
  async () => {
    const user = await session.get('user');

    return user?.subject;
  };
