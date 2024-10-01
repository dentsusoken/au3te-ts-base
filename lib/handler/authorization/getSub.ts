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
import { GetUserSubject } from './getUserSubject';

/**
 * Represents a function that generates a subject identifier (sub) based on the authorization response.
 *
 * @param {AuthorizationResponse} response - The authorization response containing client information.
 * @returns {Promise<string | undefined>} A promise that resolves to the subject identifier or undefined if not available.
 */
export type GetSub = (
  response: AuthorizationResponse
) => Promise<string | undefined>;

/**
 * Creates a function to generate a subject identifier (sub) based on the user subject and client information.
 *
 * This function handles both public and pairwise subject types as defined in OpenID Connect Core 1.0.
 * For pairwise subjects, it generates a unique identifier using SHA-256 hashing.
 *
 * @param {GetUserSubject} getUserSubject - A function to retrieve the user's subject.
 * @returns {GetSub} A function that generates the subject identifier.
 */
export const createGetSub =
  (getUserSubject: GetUserSubject): GetSub =>
  async (response) => {
    const client = response.client;
    const userSubject = await getUserSubject();

    if (!userSubject) {
      return undefined;
    }

    if (client?.subjectType === 'pairwise') {
      const subjectType = client.subjectType;
      const sectorIdentifier = client.derivedSectorIdentifier;

      if (!sectorIdentifier) {
        return undefined;
      }

      const data = new TextEncoder().encode(
        `${subjectType}-${sectorIdentifier}-${userSubject}`
      );
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));

      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    return userSubject;
  };
