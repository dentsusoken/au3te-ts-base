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

import { BaseSession } from '../../session/BaseSession';
import { BaseEndpoint, BaseEndpointConstructorOptions } from '../BaseEndpoint';
import { CheckAuthAge, createCheckAuthAge } from './checkAuthAge';
import { CheckPrompts, defaultCheckPrompts } from './checkPrompts';
import {
  ClearCurrentUserInfoInSession,
  createClearCurrentUserInfoInSession,
} from './clearCurrentUserInfoInSession';
import {
  ClearCurrentUserInfoInSessionIfNecessary,
  createClearCurrentUserInfoInSessionIfNecessary,
} from './clearCurrentUserInfoInSessionIfNecessary';
import { createGetAuthTime, GetAuthTime } from './getAuthTime';
import { createGetSub, GetSub } from './getSub';
import { createGetUserSubject, GetUserSubject } from './getUserSubject';
import {
  createIsUserAuthenticated,
  IsUserAuthenticated,
} from './isUserAuthenticated';

export const AUTHORIZATION_PATH = '/api/auth/authorization';

export type AuthorizationEndpointConstructorOptions = {
  isUserAuthenticated?: IsUserAuthenticated;
  getAuthTime?: GetAuthTime;
  clearCurrentUserInfoInSession?: ClearCurrentUserInfoInSession;
  checkPrompts?: CheckPrompts;
  checkAuthAge?: CheckAuthAge;
  clearCurrentUserInfoInSessionIfNecessary?: ClearCurrentUserInfoInSessionIfNecessary;
  getUserSubject?: GetUserSubject;
  getSub?: GetSub;
} & BaseEndpointConstructorOptions;

export class AuthorizationEndpoint extends BaseEndpoint {
  session: BaseSession;
  isUserAuthenticated: IsUserAuthenticated;
  getAuthTime: GetAuthTime;
  clearCurrentUserInfoInSession: ClearCurrentUserInfoInSession;
  checkPrompts: CheckPrompts;
  checkAuthAge: CheckAuthAge;
  clearCurrentUserInfoInSessionIfNecessary: ClearCurrentUserInfoInSessionIfNecessary;
  getUserSubject: GetUserSubject;
  getSub: GetSub;

  constructor(
    session: BaseSession,
    options: AuthorizationEndpointConstructorOptions = {}
  ) {
    super(AUTHORIZATION_PATH, options);
    this.session = session;
    this.isUserAuthenticated =
      options.isUserAuthenticated ?? createIsUserAuthenticated(this.session);
    this.getAuthTime = options.getAuthTime ?? createGetAuthTime(this.session);
    this.clearCurrentUserInfoInSession =
      options.clearCurrentUserInfoInSession ??
      createClearCurrentUserInfoInSession(this.session);
    this.checkPrompts = options.checkPrompts ?? defaultCheckPrompts;
    this.checkAuthAge =
      options.checkAuthAge ?? createCheckAuthAge(this.getAuthTime);
    this.clearCurrentUserInfoInSessionIfNecessary =
      options.clearCurrentUserInfoInSessionIfNecessary ??
      createClearCurrentUserInfoInSessionIfNecessary({
        checkPrompts: this.checkPrompts,
        checkAuthAge: this.checkAuthAge,
        clearCurrentUserInfoInSession: this.clearCurrentUserInfoInSession,
      });
    this.getUserSubject =
      options.getUserSubject ?? createGetUserSubject(this.session);
    this.getSub = options.getSub ?? createGetSub(this.getUserSubject);
  }
}
