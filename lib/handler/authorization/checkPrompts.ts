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

/**
 * Represents a function that checks the prompts in an AuthorizationResponse.
 *
 * @param {AuthorizationResponse} response - The authorization response to check.
 * @returns {boolean} True if re-authentication is required, false otherwise.
 */
export type CheckPrompts = (response: AuthorizationResponse) => boolean;

/**
 * Default implementation of CheckPrompts.
 * Checks if the 'login' prompt is present in the authorization response.
 *
 * @param {AuthorizationResponse} response - The authorization response to check.
 * @returns {boolean} True if the 'login' prompt is present, indicating that
 *                    the user's session should be cleared and re-authentication
 *                    is required. False otherwise.
 */
export const defaultCheckPrompts: CheckPrompts = (response) => {
  const prompts = response.prompts ?? [];

  return prompts.includes('login');
};
