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

import { BuildUnknownActionMessage } from 'au3te-ts-common/handler';

/**
 * Represents a function that processes an API response and returns a Promise of Response.
 * @template RES - The type of the API response.
 * @param {RES} apiResponse - The API response to be processed.
 * @returns {Promise<Response>} A promise that resolves to a Response object.
 */
export type ProcessApiResponse<RES> = (apiResponse: RES) => Promise<Response>;

export type CreateProcessApiResponseParams = {
  /** The path of the API endpoint. */
  path: string;
  /** Function to build an unknown action message. */
  buildUnknownActionMessage: BuildUnknownActionMessage;
};
