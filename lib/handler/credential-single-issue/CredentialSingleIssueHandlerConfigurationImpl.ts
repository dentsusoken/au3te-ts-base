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

import { ExtractorConfiguration } from '../../extractor/ExtractorConfiguration';
import { BaseCredentialHandlerConfiguration } from '../credential/BaseCredentialHandlerConfiguration';
import { IntrospectionHandlerConfiguration } from '../introspection/IntrospectionHandlerConfiguration';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { SessionSchemas } from '../../session';
import { sessionSchemas } from '../../session/sessionSchemas';
import { createToApiRequest } from './toApiRequest';
import { CredentialSingleParseHandlerConfiguration } from '../credential-single-parse/CredentialSingleParseHandlerConfiguration';
import { CommonCredentialHandlerConfiguration } from 'au3te-ts-common/handler.credential';
import { createProcessApiRequest } from '../processApiRequest';
import { credentialSingleIssueResponseSchema } from 'au3te-ts-common/schemas.credential-single-issue';
import { createProcessApiResponse } from './processApiResponse';
import { createHandleWithOptions } from '../handleWithOptions';
import { createProcessRequestWithOptions } from '../processRequestWithOptions';

type CreateCredentialSingleIssueHandlerConfigurationImplParams<
  SS extends SessionSchemas
> = {
  extractorConfiguration: ExtractorConfiguration;
  baseCredentialHandlerConfiguration: BaseCredentialHandlerConfiguration;
  introspectionHandlerConfiguration: IntrospectionHandlerConfiguration;
  baseHandlerConfiguration: BaseHandlerConfiguration<SS>;
  credentialSingleParseHandlerConfiguration: CredentialSingleParseHandlerConfiguration;
  commonCredentialHandlerConfiguration: CommonCredentialHandlerConfiguration;
};

/**
 * Implementation of the Credential Single Issue Handler Configuration.
 *
 * @class CredentialSingleIssueHandlerConfigurationImpl
 * @implements {CredentialSingleIssueHandlerConfiguration}
 */
export class CredentialSingleIssueHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> {
  readonly path = '/api/credential';

  readonly toApiRequest;

  readonly processApiRequest;

  readonly processApiResponse;

  readonly handle;

  readonly processRequest;

  constructor({
    extractorConfiguration,
    baseCredentialHandlerConfiguration,
    introspectionHandlerConfiguration,
    baseHandlerConfiguration,
    credentialSingleParseHandlerConfiguration,
    commonCredentialHandlerConfiguration,
  }: CreateCredentialSingleIssueHandlerConfigurationImplParams<SS>) {
    this.toApiRequest = createToApiRequest({
      extractAccessToken: extractorConfiguration.extractAccessToken,
      extractClientCertificateAndPath:
        extractorConfiguration.extractClientCertificateAndPath,
      extractParameters: extractorConfiguration.extractParameters,
      computeHtu: baseCredentialHandlerConfiguration.computeHtu,
      introspect:
        introspectionHandlerConfiguration.processApiRequestWithValidation,
      prepareHeaders: baseHandlerConfiguration.prepareHeaders,
      parseSingleCredential:
        credentialSingleParseHandlerConfiguration.processApiRequestWithValidation,
      getToOrder: commonCredentialHandlerConfiguration.getToOrder,
    });

    this.processApiRequest = createProcessApiRequest(
      baseHandlerConfiguration.apiClient.credentialSingleIssuePath,
      credentialSingleIssueResponseSchema,
      baseHandlerConfiguration.apiClient
    );

    this.processApiResponse = createProcessApiResponse({
      path: this.path,
      buildUnknownActionMessage:
        baseHandlerConfiguration.buildUnknownActionMessage,
    });

    this.handle = createHandleWithOptions({
      path: this.path,
      processApiRequest: this.processApiRequest,
      processApiResponse: this.processApiResponse,
      recoverResponseResult: baseHandlerConfiguration.recoverResponseResult,
    });

    this.processRequest = createProcessRequestWithOptions({
      path: this.path,
      toApiRequest: this.toApiRequest,
      handle: this.handle,
      recoverResponseResult: baseHandlerConfiguration.recoverResponseResult,
    });
  }
}
