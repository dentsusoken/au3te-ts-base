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

import { PushedAuthReqRequest } from 'au3te-ts-common/schemas.par';
import { parHandlerConfiguration } from './configurations';

export const createParParameters = () => {
  return new URLSearchParams({
    scope: 'org.iso.18013.5.1.mDL openid',
    redirect_uri: 'eudi-openid4ci://authorize/',
    response_type: 'code',
    client_id: 'tw24.wallet.dentsusoken.com',
  }).toString();
};

export const createParRequest = () => {
  const request: PushedAuthReqRequest = {
    parameters: createParParameters(),
  };

  return request;
};

export const createParPostRequest = () => {
  const request = new Request('http://localhost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: createParParameters(),
  });

  return request;
};

export const processParPostRequest = async () => {
  const request = createParPostRequest();
  const response = await parHandlerConfiguration.processRequest(request);
  const body = await response.json();

  return body.request_uri!;
};
