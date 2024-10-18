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
  CredentialIssuerMetadataRequest,
  CredentialIssuerMetadataResponse,
  credentialIssuerMetadataResponseSchema,
} from 'au3te-ts-common/schemas.credential-metadata';
import { ApiClient } from 'au3te-ts-common/api';

export const CREDENTIAL_ISSUER_METADATA_PATH =
  '/.well-known/openid-credential-issuer';

export type CredentialIssuerMetadataReqHandlerConstructorOptions<
  REQ extends object,
  RES
> = {
  processApiResponse?: ProcessApiResponse<RES>;
  processApiRequest?: ProcessApiRequest<REQ, RES>;
  recoverResponseResult?: RecoverResponseResult;
  handle?: Handle<REQ>;
} & BaseHandlerConstructorOptions;

export class CredentialIssuerMetadataReqHandler<
  REQ extends CredentialIssuerMetadataRequest = CredentialIssuerMetadataRequest,
  RES extends CredentialIssuerMetadataResponse = CredentialIssuerMetadataResponse
> extends BaseHandler {
  apiClient: ApiClient;
  processApiResponse: ProcessApiResponse<RES>;
  processApiRequest: ProcessApiRequest<REQ, RES>;
  recoverResponseResult: RecoverResponseResult;
  handle: Handle<REQ>;

  constructor(
    apiClient: ApiClient,
    options: CredentialIssuerMetadataReqHandlerConstructorOptions<REQ, RES> = {}
  ) {
    super(CREDENTIAL_ISSUER_METADATA_PATH, options);
    this.apiClient = apiClient;
    this.processApiResponse =
      options.processApiResponse ??
      (createProcessApiResponse(
        this.buildUnknownActionMessage
      ) as ProcessApiResponse<RES>);
    this.processApiRequest =
      options.processApiRequest ??
      (createProcessGetApiRequest(
        apiClient.credentialIssuerMetadataPath,
        credentialIssuerMetadataResponseSchema,
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
