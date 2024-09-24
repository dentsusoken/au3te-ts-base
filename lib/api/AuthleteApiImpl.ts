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

import { AbstractAuthleteApi } from 'au3te-ts-common/api';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import * as apiPath from './authleteApiPath';

export class AuthleteApiImpl extends AbstractAuthleteApi {
  protected readonly baseUrl: string;
  protected readonly auth: string;
  protected readonly pushAuthorizationRequestPath: string;
  protected readonly authorizationPath: string;
  protected readonly authorizationFailPath: string;

  constructor(protected configuration: AuthleteConfiguration) {
    super();
    this.baseUrl = configuration.baseUrl;
    this.auth = 'Bearer ' + this.configuration.serviceAccessToken;
    this.pushAuthorizationRequestPath = apiPath.pushedAuthReqPath(
      this.configuration.serviceApiKey
    );
    this.authorizationPath = apiPath.authorizationPath(
      this.configuration.serviceApiKey
    );
    this.authorizationFailPath = apiPath.authorizationFailPath(
      this.configuration.serviceApiKey
    );
  }
}
