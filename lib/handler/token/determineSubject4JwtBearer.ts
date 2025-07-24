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
import { runAsyncCatching } from '@vecrea/oid4vc-core/utils';
import { getSubFromJwt } from '@vecrea/au3te-ts-common/utils';
import { DetermineSubject } from './determineSubject';
import { ResponseErrorFactory } from '../responseErrorFactory';

/**
 * Default implementation for determining the subject identifier from a JWT Bearer token response.
 *
 * This implementation follows the JWT Bearer Token Profile for OAuth 2.0 (RFC 7523).
 * It extracts the subject identifier from the JWT assertion provided in the token
 * response. The JWT must contain a valid 'sub' claim.
 *
 * @param apiResponse - The token response containing the JWT assertion
 * @returns A promise that resolves to the subject identifier extracted from the JWT
 * @throws {Error} If the assertion is missing or invalid, or if the subject cannot be extracted
 *
 * @example
 * ```typescript
 * const subject = await defaultDetermineSubject4JwtBearer({
 *   assertion: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   // ... other response properties
 * });
 * ```
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7523|RFC 7523 - JWT Profile for OAuth 2.0 Client Authentication and Authorization Grants}
 */
export const defaultDetermineSubject4JwtBearer: DetermineSubject = async (
  apiResponse: TokenResponse,
  responseErrorFactory: ResponseErrorFactory
) => {
  const { assertion } = apiResponse;

  if (!assertion) {
    throw responseErrorFactory.badRequestResponseError(
      'Assertion is missing. ' +
        'The assertion must be provided by the token endpoint.'
    );
  }

  const result = await runAsyncCatching(async () => getSubFromJwt(assertion));

  return result.getOrElse((e) => {
    throw responseErrorFactory.badRequestResponseError(e.message);
  });
};
