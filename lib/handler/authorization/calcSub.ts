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

import { Client } from 'au3te-ts-common/schemas.common';

/**
 * Calculates a subject identifier (sub) based on the given subject and client information.
 * @param {string | undefined} subject - The original subject identifier.
 * @param {Client | undefined} client - The client object containing subject type and sector identifier.
 * @returns {Promise<string | undefined>} A promise that resolves to the calculated sub or undefined.
 */
export type CalcSub = (
  subject: string | undefined,
  client: Client | undefined
) => Promise<string | undefined>;

/**
 * Default implementation of the CalcSub function.
 * @param {string | undefined} subject - The original subject identifier.
 * @param {Client | undefined} client - The client object containing subject type and sector identifier.
 * @returns {Promise<string | undefined>} A promise that resolves to the calculated sub or undefined.
 */
export const defaultCalcSub: CalcSub = async (subject, client) => {
  if (
    !subject ||
    !client ||
    client.subjectType !== 'pairwise' ||
    !client.derivedSectorIdentifier
  ) {
    return undefined;
  }

  const subjectType = client.subjectType;
  const sectorIdentifier = client.derivedSectorIdentifier;

  const data = new TextEncoder().encode(
    `${subjectType}-${sectorIdentifier}-${subject}`
  );
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
