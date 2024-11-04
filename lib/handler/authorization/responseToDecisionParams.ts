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
 * Adds 'txn' to the claim names array if claims are present
 * @param {string[] | undefined} claimNames - The original claim names array
 * @returns {string[] | undefined} Updated claim names array with 'txn' added if applicable
 */
const addTxnToClaimNames = (
  claimNames: string[] | undefined
): string[] | undefined => {
  if (!claimNames) {
    // if no claims were requested it can't be a connectid au request
    return undefined;
  }

  // txn will now be returned for any requests that request oidc claims
  return [...claimNames, 'txn'];
};

const normalizeClaimLocales = (
  claimLocales: string[] | undefined
): string[] | undefined => {
  if (!claimLocales || claimLocales.length === 0) {
    return undefined;
  }

  // From 5.2. Claims Languages and Scripts in OpenID Connect Core 1.0
  //
  //     However, since BCP47 language tag values are case insensitive,
  //     implementations SHOULD interpret the language tag values
  //     supplied in a case insensitive manner.
  //
  const lowerSet = new Set<string>();
  const list: string[] = [];

  claimLocales.forEach((claimLocale) => {
    claimLocale = claimLocale?.trim();
    // If the claim locale is empty.
    if (!claimLocale) {
      return;
    }

    // If the claim locale is a duplicate (case insensitive check).
    const lowerClaimLocale = claimLocale.toLowerCase();
    if (lowerSet.has(lowerClaimLocale)) {
      return;
    }

    lowerSet.add(lowerClaimLocale);
    list.push(claimLocale);
  });

  return list.length === 0 ? undefined : list;
};

/**
 * Default conversion function from AuthorizationResponse to AuthorizationDecisionParams
 * @param {AuthorizationResponse} response - The authorization response
 * @returns {AuthorizationDecisionParams} The authorization decision parameters
 */
export const defaultResponseToDecisionParams: ResponseToDecisionParams = (
  response
) => ({
  ticket: response.ticket!,
  claimNames: addTxnToClaimNames(response.claims),
  claimLocales: normalizeClaimLocales(response.claimsLocales),
  idTokenClaims: response.idTokenClaims,
  requestedClaimsForTx: response.requestedClaimsForTx,
  requestedVerifiedClaimsForTx: response.requestedVerifiedClaimsForTx,
});
