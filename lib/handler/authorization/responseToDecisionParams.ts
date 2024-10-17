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

import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';
import { AuthorizationDecisionParams } from 'au3te-ts-common/schemas.authorization-decision';

/**
 * Type definition for a function that converts AuthorizationResponse to AuthorizationDecisionParams
 * @param {AuthorizationResponse} response - The authorization response
 * @returns {AuthorizationDecisionParams} The authorization decision parameters
 */
export type ResponseToDecisionParams = (
  response: AuthorizationResponse
) => AuthorizationDecisionParams;

/**
 * Default conversion function from AuthorizationResponse to AuthorizationDecisionParams
 * @param {AuthorizationResponse} response - The authorization response
 * @returns {AuthorizationDecisionParams} The authorization decision parameters
 */
export const defaultResponseToDecisionParams: ResponseToDecisionParams = (
  response
) => ({
  ticket: response.ticket!,
  claimNames: response.claims,
  claimLocales: response.claimsLocales,
  idTokenClaims: response.idTokenClaims,
  requestedClaimsForTx: response.requestedClaimsForTx,
  requestedVerifiedClaimsForTx: response.requestedVerifiedClaimsForTx,
});
