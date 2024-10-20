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

import { buildAuthorizationPageModel } from 'au3te-ts-common/page-model.authorization';
import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';
import { BaseSession } from '../../session/BaseSession';
import { ClearCurrentUserInfoInSessionIfNecessary } from './clearCurrentUserInfoInSessionIfNecessary';
import { BuildResponse } from './buildResponse';
import { ResponseToDecisionParams } from './responseToDecisionParams';

export type GenerateAuthorizationPage = (
  response: AuthorizationResponse,
  session: BaseSession
) => Promise<Response>;

type GenerateAuthorizationPageParams = {
  responseToDecisionParams: ResponseToDecisionParams;
  clearCurrentUserInfoInSessionIfNecessary: ClearCurrentUserInfoInSessionIfNecessary;
  buildResponse: BuildResponse;
};

export const createGenerateAuthorizationPage =
  ({
    responseToDecisionParams,
    clearCurrentUserInfoInSessionIfNecessary,
    buildResponse,
  }: GenerateAuthorizationPageParams): GenerateAuthorizationPage =>
  async (response, session) => {
    const authorizationDecisionParams = responseToDecisionParams(response);
    const acrs = response.acrs;
    const client = response.client;

    await session.setBatch({
      authorizationDecisionParams,
      acrs,
      client,
    });
    await clearCurrentUserInfoInSessionIfNecessary(response, session);
    const user = await session.get('user');
    const model = buildAuthorizationPageModel(response, user);

    return buildResponse(model);
  };
