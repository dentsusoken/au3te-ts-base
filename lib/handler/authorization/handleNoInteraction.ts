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
import { AuthorizationIssueRequest } from 'au3te-ts-common/schemas.authorization-issue';
import { BaseSession } from '../../session/BaseSession';
import { CheckAuthAge } from './checkAuthAge';
import { BuildAuthorizationFailError } from './buildAuthorizationFailError';
import { CheckSubject } from './checkSubject';
import { CalcSub } from './calcSub';
import { AuthorizationIssueHandler } from '../authorization-issue/AuthorizationIssueHandler';

/**
 * Represents a function that handles the no-interaction flow in the authorization process.
 * @param {AuthorizationResponse} response - The authorization response object.
 * @param {BaseSession} session - The session object.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
export type HandleNoInteraction = (
  response: AuthorizationResponse,
  session: BaseSession
) => Promise<Response>;

/**
 * Parameters for creating a HandleNoInteraction function.
 */
type CreateHandleNoInteractionParams = {
  checkAuthAge: CheckAuthAge;
  checkSubject: CheckSubject;
  calcSub: CalcSub;
  buildAuthorizationFailError: BuildAuthorizationFailError;
  authorizationIssueHandler: AuthorizationIssueHandler;
};

/**
 * Creates a function to handle the no-interaction flow in the authorization process.
 * @param {CreateHandleNoInteractionParams} params - The parameters for creating the function.
 * @returns {HandleNoInteraction} A function that handles the no-interaction flow.
 */
export const createHandleNoInteraction = ({
  checkAuthAge,
  checkSubject,
  calcSub,
  buildAuthorizationFailError,
  authorizationIssueHandler,
}: CreateHandleNoInteractionParams): HandleNoInteraction => {
  return async (response, session) => {
    const { user, authTime: rawAuthTime } = await session.getBatch(
      'user',
      'authTime'
    );
    const authTime = rawAuthTime ?? 0;

    if (!user) {
      throw await buildAuthorizationFailError(
        response.ticket!,
        'NOT_LOGGED_IN'
      );
    }

    if (checkAuthAge(authTime, response.maxAge)) {
      throw await buildAuthorizationFailError(
        response.ticket!,
        'EXCEEDS_MAX_AGE'
      );
    }

    const subject = response.subject;

    if (checkSubject(subject, user.subject)) {
      throw await buildAuthorizationFailError(
        response.ticket!,
        'DIFFERENT_SUBJECT'
      );
    }

    const sub = await calcSub(subject, response.client);
    const ticket = response.ticket!;
    const authorizationIssueRequest: AuthorizationIssueRequest = {
      ticket,
      subject,
      authTime,
      sub,
    };

    return authorizationIssueHandler.handle(authorizationIssueRequest);
  };
};
