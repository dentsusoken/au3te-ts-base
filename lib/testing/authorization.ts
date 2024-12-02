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

import { session } from './configurations';

import { AuthorizationRequest } from 'au3te-ts-common/schemas.authorization';
import { authorizationHandlerConfiguration } from './configurations';

export const createAuthorizationParameters = (requestUri: string) => {
  return new URLSearchParams({
    client_id: 'tw24.wallet.dentsusoken.com',
    request_uri: requestUri,
  }).toString();
};
export const createAuthorizationRequest = (requestUri: string) => {
  const request: AuthorizationRequest = {
    parameters: createAuthorizationParameters(requestUri),
  };

  return request;
};
export const createAuthorizationGetRequest = (requestUri: string) => {
  const request = new Request(
    `http://localhost?${createAuthorizationParameters(requestUri)}`
  );

  return request;
};
export const processAuthorizationGetRequest = async (requestUri: string) => {
  const request = createAuthorizationGetRequest(requestUri);
  await authorizationHandlerConfiguration.processRequest(request);
  const decisionParams = await session.get('authorizationDecisionParams');

  return decisionParams!.ticket!;
};
