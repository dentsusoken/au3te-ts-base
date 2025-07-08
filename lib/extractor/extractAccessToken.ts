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

import { parseDpopToken, parseBearerToken } from '@vecrea/au3te-ts-common/utils';

/**
 * Function type for extracting an access token from a request.
 * @param request - The HTTP request object
 * @returns The extracted access token or undefined if not found
 */
export type ExtractAccessToken = (request: Request) => string | undefined;

/**
 * Default implementation for extracting an access token from a request.
 * Attempts to extract either a DPoP or Bearer token from the Authorization header.
 *
 * @param request - The HTTP request object
 * @returns The extracted access token or undefined if not found
 */
export const defaultExtractAccessToken = (
  request: Request
): string | undefined => {
  const auth = request.headers.get('Authorization') ?? undefined;

  return parseDpopToken(auth) ?? parseBearerToken(auth);
};
