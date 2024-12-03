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

import { CredentialSingleIssueHandlerConfiguration } from './CredentialSingleIssueHandlerConfiguration';
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
> implements CredentialSingleIssueHandlerConfiguration
{
  readonly toApiRequest;

  readonly processApiRequest;

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
  }
}
