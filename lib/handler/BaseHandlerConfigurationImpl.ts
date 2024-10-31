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

import { CommonHandlerConfigurationImpl } from 'au3te-ts-common/handler';
import { BaseHandlerConfiguration } from './BaseHandlerConfiguration';
import {
  createRecoverResponseResult,
  RecoverResponseResult,
} from './recoverResponseResult';
import { Session } from '../session/Session';
import { SessionSchemas } from '../session/types';
import { ApiClient } from 'au3te-ts-common/api';

/**
 * Implementation of the BaseHandlerConfiguration interface.
 * @template SS - The type of session schemas, extending SessionSchemas.
 * @extends {CommonHandlerConfigurationImpl}
 * @implements {BaseHandlerConfiguration<SS>}
 */
export class BaseHandlerConfigurationImpl<SS extends SessionSchemas>
  extends CommonHandlerConfigurationImpl
  implements BaseHandlerConfiguration<SS>
{
  /** The API client used for making requests. */
  apiClient: ApiClient;

  /** The session object for managing user sessions. */
  session: Session<SS>;

  /** Function to recover from response errors. */
  recoverResponseResult: RecoverResponseResult;

  /**
   * Creates an instance of BaseHandlerConfigurationImpl.
   * @param {ApiClient} apiClient - The API client to use.
   * @param {Session<SS>} session - The session object to use.
   */
  constructor(apiClient: ApiClient, session: Session<SS>) {
    super();
    this.apiClient = apiClient;
    this.session = session;
    this.recoverResponseResult = createRecoverResponseResult(this.processError);
  }
}
