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

import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';
import { ResponseErrorFactory } from '../responseErrorFactory';

/**
 * Function type for determining the subject from a token response.
 *
 * @param apiResponse - The token response from the authorization server
 * @param responseErrorFactory - The factory for creating response errors
 * @returns A promise that resolves to the subject identifier string
 * @throws {Error} If the subject cannot be determined from the response
 */
export type DetermineSubject = (
  apiResponse: TokenResponse,
  responseErrorFactory: ResponseErrorFactory
) => Promise<string>;
