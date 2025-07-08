/*
 * Copyright (C) 2024 Dentsusoken, Inc.
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

import {
  CLAIMS,
  DOCTYPE,
  FORMAT,
  MSO_MDOC,
} from '@vecrea/au3te-ts-common/handler.credential';
import { CredentialIssuanceOrder } from '@vecrea/au3te-ts-common/schemas.credential';
import { CredentialSingleIssueRequest } from '@vecrea/au3te-ts-common/schemas.credential-single-issue';

export const createCredentialSingleIssueRequest = (
  accessToken: string,
  order: CredentialIssuanceOrder
) => {
  const request: CredentialSingleIssueRequest = {
    accessToken,
    order,
  };

  return request;
};

export const createCredentialSingleIssuePostRequest = (accessToken: string) => {
  const request = new Request('https://example.com/credential', {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      [FORMAT]: MSO_MDOC,
      [DOCTYPE]: 'org.iso.18013.5.1.mDL',
      [CLAIMS]: {
        'org.iso.18013.5.1': {
          family_name: {},
          given_name: {},
        },
      },
    }),
  });

  return request;
};
