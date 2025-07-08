/*
 * Copyright (C) 2014-2024 Authlete, Inc.
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
 * Represents a function that checks if the 'login' prompt is included in the given array of prompts.
 * @param {string[] | undefined | null} prompts - An array of prompt strings or undefined or null.
 * @returns {boolean} True if 'login' is included in the prompts, false otherwise.
 */
export type CheckPrompts = (prompts: string[] | undefined | null) => boolean;

/**
 * Default implementation of the CheckPrompts function.
 * @param {string[] | undefined} prompts - An array of prompt strings or undefined.
 * @returns {boolean} True if 'login' is included in the prompts, false if prompts is undefined or doesn't include 'login'.
 */
export const defaultCheckPrompts: CheckPrompts = (prompts) => {
  if (!prompts) {
    return false;
  }

  return prompts.includes('login');
};
