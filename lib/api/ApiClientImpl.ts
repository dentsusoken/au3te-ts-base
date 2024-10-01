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

import { AbstractApiClient } from 'au3te-ts-common/api';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import * as apiPath from './authleteApiPath';

/**
 * Implementation of the ApiClient interface extending AbstractApiClient.
 * This class provides concrete implementations for API client operations.
 * @extends AbstractApiClient
 */
export class ApiClientImpl extends AbstractApiClient {
  /** The base URL for API requests */
  readonly baseUrl: string;

  /** The authorization token for API requests */
  readonly auth: string;

  /** The path for pushed authorization requests */
  readonly pushAuthorizationRequestPath: string;

  /** The path for authorization requests */
  readonly authorizationPath: string;

  /** The path for failed authorization requests */
  readonly authorizationFailPath: string;

  /**
   * Creates an instance of ApiClientImpl.
   * @param {AuthleteConfiguration} configuration - The configuration object for Authlete service.
   */
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
