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
import { ServerCredentialHandlerConfiguration } from '../credential/ServerCredentialHandlerConfiguration';
import { IntrospectionHandlerConfiguration } from '../introspection/IntrospectionHandlerConfiguration';
import { ServerHandlerConfiguration } from '../ServerHandlerConfiguration';
import { SessionSchemas } from '../../session';
import { sessionSchemas } from '../../session/sessionSchemas';
import { createToApiRequest } from './toApiRequest';
import { CredentialSingleParseHandlerConfiguration } from '../credential-single-parse/CredentialSingleParseHandlerConfiguration';
import { CommonCredentialHandlerConfiguration } from '@vecrea/au3te-ts-common/handler.credential';
import { createProcessApiRequest } from '../processApiRequest';
import { credentialSingleIssueResponseSchema } from '@vecrea/au3te-ts-common/schemas.credential-single-issue';
import { createProcessApiResponse } from './processApiResponse';
import { createHandleWithOptions } from '../handleWithOptions';
import { createProcessRequestWithOptions } from '../processRequestWithOptions';

type CreateCredentialSingleIssueHandlerConfigurationImplParams<
  SS extends SessionSchemas
> = {
  extractorConfiguration: ExtractorConfiguration;
  serverCredentialHandlerConfiguration: ServerCredentialHandlerConfiguration;
  introspectionHandlerConfiguration: IntrospectionHandlerConfiguration;
  serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  credentialSingleParseHandlerConfiguration: CredentialSingleParseHandlerConfiguration;
  commonCredentialHandlerConfiguration: CommonCredentialHandlerConfiguration;
};

/**
 * The path for the credential single issue endpoint.
 */
export const CREDENTIAL_SINGLE_ISSUE_PATH = '/api/credential';

/**
 * Implementation of the Credential Single Issue Handler Configuration.
 *
 * @class CredentialSingleIssueHandlerConfigurationImpl
 * @implements {CredentialSingleIssueHandlerConfiguration}
 */
export class CredentialSingleIssueHandlerConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> {
  readonly path = CREDENTIAL_SINGLE_ISSUE_PATH;

  readonly toApiRequest;

  readonly processApiRequest;

  readonly processApiResponse;

  readonly handle;

  readonly processRequest;

  constructor({
    extractorConfiguration,
    serverCredentialHandlerConfiguration,
    introspectionHandlerConfiguration,
    serverHandlerConfiguration,
    credentialSingleParseHandlerConfiguration,
    commonCredentialHandlerConfiguration,
  }: CreateCredentialSingleIssueHandlerConfigurationImplParams<SS>) {
    this.toApiRequest = createToApiRequest({
      extractAccessToken: extractorConfiguration.extractAccessToken,
      extractClientCertificateAndPath:
        extractorConfiguration.extractClientCertificateAndPath,
      extractParameters: extractorConfiguration.extractParameters,
      computeHtu: serverCredentialHandlerConfiguration.computeHtu,
      introspect:
        introspectionHandlerConfiguration.processApiRequestWithValidation,
      prepareHeaders: serverHandlerConfiguration.prepareHeaders,
      parseSingleCredential:
        credentialSingleParseHandlerConfiguration.processApiRequestWithValidation,
      getToOrder: commonCredentialHandlerConfiguration.getToOrder,
    });

    this.processApiRequest = createProcessApiRequest(
      serverHandlerConfiguration.apiClient.credentialSingleIssuePath,
      credentialSingleIssueResponseSchema,
      serverHandlerConfiguration.apiClient
    );

    this.processApiResponse = createProcessApiResponse({
      path: this.path,
      buildUnknownActionMessage:
        serverHandlerConfiguration.buildUnknownActionMessage,
    });

    this.handle = createHandleWithOptions({
      path: this.path,
      processApiRequest: this.processApiRequest,
      processApiResponse: this.processApiResponse,
      recoverResponseResult: serverHandlerConfiguration.recoverResponseResult,
    });

    this.processRequest = createProcessRequestWithOptions({
      path: this.path,
      toApiRequest: this.toApiRequest,
      handle: this.handle,
      recoverResponseResult: serverHandlerConfiguration.recoverResponseResult,
    });
  }
}
