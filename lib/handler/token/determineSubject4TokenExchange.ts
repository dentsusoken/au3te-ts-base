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
import { TokenInfo } from '@vecrea/au3te-ts-common/schemas.common';
import { DetermineSubject } from './determineSubject';
import { ResponseErrorFactory } from '../core/responseErrorFactory';

/**
 * Extracts the subject identifier from a token info object.
 *
 * This function is specifically used for access tokens and refresh tokens where
 * the subject information is provided in the token info structure returned by
 * the token introspection endpoint.
 *
 * @param subjectTokenInfo - Token information object containing subject details
 * @returns A promise that resolves to the subject identifier
 * @throws {Error} If token info is missing or doesn't contain a subject
 */
export const determineSubjectBySubjectTokenInfo = async (
  subjectTokenInfo: TokenInfo | undefined | null,
  responseErrorFactory: ResponseErrorFactory
): Promise<string> => {
  if (!subjectTokenInfo) {
    throw responseErrorFactory.badRequestResponseError(
      'Subject token info is missing. ' +
        'For access tokens and refresh tokens, subject token info must be provided by the token endpoint.'
    );
  }

  if (!subjectTokenInfo.subject) {
    throw responseErrorFactory.badRequestResponseError(
      'Subject is missing in the token info. ' +
        'The token introspection endpoint must return the subject associated with the token.'
    );
  }

  return subjectTokenInfo.subject;
};

/**
 * Extracts the subject identifier from a JWT token string.
 *
 * This function is used for JWT tokens and ID tokens where the subject
 * identifier is embedded within the token itself. It decodes the JWT
 * and extracts the 'sub' claim.
 *
 * @param subjectToken - The JWT token string to extract the subject from
 * @returns A promise that resolves to the subject identifier
 * @throws {Error} If the token is invalid or the subject cannot be extracted
 */
export const determineSubjectBySubjectToken = async (
  subjectToken: string | undefined | null,
  responseErrorFactory: ResponseErrorFactory
): Promise<string> => {
  if (!subjectToken) {
    throw responseErrorFactory.badRequestResponseError(
      'Subject token is missing. ' +
        'The subject token must be provided by the token endpoint.'
    );
  }

  const result = await runAsyncCatching(async () =>
    getSubFromJwt(subjectToken)
  );

  return result.getOrElse((e) => {
    throw responseErrorFactory.badRequestResponseError(e.message);
  });
};

/**
 * Default implementation for determining the subject identifier from a token exchange response.
 *
 * This implementation handles different token types according to RFC 8693:
 * - Access tokens and refresh tokens: Extracts subject from token info
 * - JWT and ID tokens: Extracts subject from the token itself
 *
 * @param apiResponse - The token response containing subject token and related information
 * @returns A promise that resolves to the subject identifier
 * @throws {Error} If the subject token type is unsupported or subject cannot be determined
 *
 * @example Supported token types:
 * - urn:ietf:params:oauth:token-type:access_token
 * - urn:ietf:params:oauth:token-type:refresh_token
 * - urn:ietf:params:oauth:token-type:jwt
 * - urn:ietf:params:oauth:token-type:id_token
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc8693|RFC 8693 - OAuth 2.0 Token Exchange}
 */
export const defaultDetermineSubject4TokenExchange: DetermineSubject = async (
  apiResponse: TokenResponse,
  responseErrorFactory: ResponseErrorFactory
) => {
  const { subjectTokenType, subjectTokenInfo, subjectToken } = apiResponse;

  switch (subjectTokenType) {
    case 'urn:ietf:params:oauth:token-type:access_token':
    case 'urn:ietf:params:oauth:token-type:refresh_token':
      return determineSubjectBySubjectTokenInfo(
        subjectTokenInfo,
        responseErrorFactory
      );
    case 'urn:ietf:params:oauth:token-type:jwt':
    case 'urn:ietf:params:oauth:token-type:id_token':
      return determineSubjectBySubjectToken(subjectToken, responseErrorFactory);
  }

  throw responseErrorFactory.badRequestResponseError(
    'Unsupported subject token type. ' +
      'The subject token type must be one of: ' +
      'access_token, refresh_token, jwt, or id_token. ' +
      `Received: ${subjectTokenType || 'undefined'}`
  );
};
