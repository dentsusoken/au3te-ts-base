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

import { BuildUnknownActionMessage } from 'au3te-ts-common/handler';

/**
 * Parameters for creating a validate API response function.
 */
export type CreateValidateApiResponseParams = {
  /** The path of the API endpoint. */
  path: string;
  /** Function to build an unknown action message. */
  buildUnknownActionMessage: BuildUnknownActionMessage;
};

/**
 * Type representing a function that validates an API response
 * @template RES - The type of the API response
 * @param {RES} apiResponse - The API response to validate
 * @returns {Promise<void>} A Promise that resolves with no value if validation succeeds
 * @throws {Error} If validation fails
 */
export type ValidateApiResponse<RES> = (apiResponse: RES) => Promise<void>;
