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
import { GetAuthTime } from './getAuthTime';

/**
 * Represents a function that checks if the authentication age exceeds the maximum allowed age.
 *
 * @param {AuthorizationResponse} response - The authorization response containing the max_age parameter.
 * @returns {Promise<boolean>} A promise that resolves to true if re-authentication is required, false otherwise.
 */
export type CheckAuthAge = (
  response: AuthorizationResponse
) => Promise<boolean>;

/**
 * Creates a function to check if the authentication age exceeds the maximum allowed age.
 *
 * This function compares the current time with the time of the last authentication (auth_time).
 * If the difference exceeds the max_age specified in the authorization response, it indicates
 * that re-authentication is required.
 *
 * @param {GetAuthTime} getAuthTime - A function that retrieves the last authentication time.
 * @returns {CheckAuthAge} A function that checks if re-authentication is required based on max_age.
 *
 * @remarks
 * If this function returns true, the user's information should be removed from the session,
 * and the user should be required to log in again. This ensures that the authentication
 * is fresh and meets the max_age requirement specified in the OpenID Connect specification.
 */
export const createCheckAuthAge =
  (getAuthTime: GetAuthTime): CheckAuthAge =>
  async (response) => {
    const maxAge = response.maxAge ?? 0;

    if (maxAge === 0) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const authTime = await getAuthTime();
    const authAge = now - authTime;

    return authAge > maxAge;
  };
