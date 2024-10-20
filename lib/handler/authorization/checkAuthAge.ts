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

/**
 * Type definition for a function that checks if the authentication age exceeds the maximum allowed age.
 * @param {number} authTime - The timestamp of when the authentication occurred.
 * @param {number | undefined} maxAge - The maximum allowed age of the authentication in seconds.
 * @returns {boolean} True if the authentication age exceeds the maximum age, false otherwise.
 */
export type CheckAuthAge = (
  authTime: number,
  maxAge: number | undefined
) => boolean;

/**
 * Default implementation of the CheckAuthAge function.
 * @param {number} authTime - The timestamp of when the authentication occurred.
 * @param {number | undefined} maxAge - The maximum allowed age of the authentication in seconds. Defaults to 0.
 * @returns {boolean} True if the authentication age exceeds the maximum age, false otherwise.
 */
export const defaultCheckAuthAge: CheckAuthAge = (authTime, maxAge = 0) => {
  if (maxAge === 0) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const authAge = now - authTime;

  return authAge > maxAge;
};
