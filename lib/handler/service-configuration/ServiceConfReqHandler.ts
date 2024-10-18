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

import { BaseHandler, BaseHandlerConstructorOptions } from '../BaseHandler';
import { ProcessApiResponse } from '../processApiResponse';
import { createProcessApiResponse } from './processApiResponse';
import {
  createProcessGetApiRequest,
  ProcessApiRequest,
} from 'au3te-ts-common/handler';
import { createHandle, Handle } from '../handle';
import {
  RecoverResponseResult,
  createRecoverResponseResult,
} from '../recoverResponseResult';
import {
  ServiceConfigurationRequest,
  ServiceConfigurationResponse,
  serviceConfigurationResponseSchema,
} from 'au3te-ts-common/schemas.service-configuration';
import { ApiClient } from 'au3te-ts-common/api';

export const SERVICE_CONF_PATH = '/.well-known/openid-configuration';

export type ServiceConfReqHandlerConstructorOptions<REQ extends object, RES> = {
  processApiResponse?: ProcessApiResponse<RES>;
  processApiRequest?: ProcessApiRequest<REQ, RES>;
  recoverResponseResult?: RecoverResponseResult;
  handle?: Handle<REQ>;
} & BaseHandlerConstructorOptions;

export class ServiceConfReqHandler<
  REQ extends ServiceConfigurationRequest = ServiceConfigurationRequest,
  RES extends ServiceConfigurationResponse = ServiceConfigurationResponse
> extends BaseHandler {
  apiClient: ApiClient;
  processApiResponse: ProcessApiResponse<RES>;
  processApiRequest: ProcessApiRequest<REQ, RES>;
  recoverResponseResult: RecoverResponseResult;
  handle: Handle<REQ>;

  constructor(
    apiClient: ApiClient,
    options: ServiceConfReqHandlerConstructorOptions<REQ, RES> = {}
  ) {
    super(SERVICE_CONF_PATH, options);
    this.apiClient = apiClient;
    this.processApiResponse =
      options.processApiResponse ??
      (createProcessApiResponse() as ProcessApiResponse<RES>);
    this.processApiRequest =
      options.processApiRequest ??
      (createProcessGetApiRequest(
        apiClient.serviceConfigurationPath,
        serviceConfigurationResponseSchema,
        this.apiClient
      ) as ProcessApiRequest<REQ, RES>);
    this.recoverResponseResult =
      options.recoverResponseResult ??
      createRecoverResponseResult(this.processError);
    this.handle =
      options.handle ??
      createHandle({
        processApiRequest: this.processApiRequest,
        processApiResponse: this.processApiResponse,
        recoverResponseResult: this.recoverResponseResult,
      });
  }
}
