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

import {
  AuthleteApi,
  PushedAuthReqRequest,
  PushedAuthReqResponse,
  pushedAuthReqResponseSchema,
  ApiCall,
  PostHttpCall,
} from 'au3te-ts-common';
import { AuthleteConfiguration } from '../conf';
import * as apiPath from './AuthleteApiPath';

export class AuthleteApiImpl implements AuthleteApi {
  private auth: string;
  private pushAuthorizationRequestPath: string;

  constructor(private configuration: AuthleteConfiguration) {
    this.auth = 'Bearer ' + configuration.serviceAccessToken;
    this.pushAuthorizationRequestPath = apiPath.pushedAuthReqPath(
      this.configuration.serviceApiKey
    );
  }

  get baseUrl(): string {
    return this.configuration.baseUrl;
  }

  pushAuthorizationRequest(
    request: PushedAuthReqRequest
  ): Promise<PushedAuthReqResponse> {
    const httpCall = new PostHttpCall(
      this.baseUrl,
      this.pushAuthorizationRequestPath,
      this.auth,
      request
    );
    const apiCall = new ApiCall(httpCall, pushedAuthReqResponseSchema);

    return apiCall.call();
  }
}
