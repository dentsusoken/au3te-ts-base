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

import { ApiClientImpl } from '../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../session/sessionSchemas';
import { InMemorySession } from '../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../handler/BaseHandlerConfigurationImpl';
import { ExtractorConfigurationImpl } from '../extractor/ExtractorConfigurationImpl';
import { ParHandlerConfigurationImpl } from '../handler/par/ParHandlerConfigurationImpl';
import { ServiceConfigurationHandlerConfigurationImpl } from '../handler/service-configuration/ServiceConfigurationHandlerConfigurationImpl';
import { CredentialMetadataHandlerConfigurationImpl } from '../handler/credential-metadata/CredentialMetadataHandlerConfigurationImpl';
import { AuthorizationHandlerConfigurationImpl } from '../handler/authorization/AuthorizationHandlerConfigurationImpl';
import { AuthorizationIssueHandlerConfigurationImpl } from '../handler/authorization-issue/AuthorizationIssueHandlerConfigurationImpl';
import { AuthorizationFailHandlerConfigurationImpl } from '../handler/authorization-fail/AuthorizationFailHandlerConfigurationImpl';
import { AuthorizationPageHandlerConfigurationImpl } from 'au3te-ts-common/handler.authorization-page';
import { AuthorizationDecisionHandlerConfigurationImpl } from '../handler/authorization-decision/AuthorizationDecisionHandlerConfigurationImpl';
import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { TokenHandlerConfigurationImpl } from '../handler/token/TokenHandlerConfigurationImpl';
import { TokenCreateHandlerConfigurationImpl } from '../handler/token-create/TokenCreateHandlerConfigurationImpl';
import { TokenFailHandlerConfigurationImpl } from '../handler/token-fail/TokenFailHandlerConfigurationImpl';
import { TokenIssueHandlerConfigurationImpl } from '../handler/token-issue/TokenIssueHandlerConfigurationImpl';
import { IntrospectionHandlerConfigurationImpl } from '../handler/introspection/IntrospectionHandlerConfigurationImpl';
import { CredentialSingleParseHandlerConfigurationImpl } from '../handler/credential-single-parse/CredentialSingleParseHandlerConfigurationImpl';
import { CommonCredentialHandlerConfigurationImpl } from 'au3te-ts-common/handler.credential';
import { BaseCredentialHandlerConfigurationImpl } from '../handler/credential/BaseCredentialHandlerConfigurationImpl';
import { CredentialSingleIssueHandlerConfigurationImpl } from '../handler/credential-single-issue/CredentialSingleIssueHandlerConfigurationImpl';

export const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};

export const apiClient = new ApiClientImpl(configuration);
export const session = new InMemorySession(sessionSchemas);
export const baseHandlerConfiguration = new BaseHandlerConfigurationImpl(
  apiClient,
  session
);
export const extractorConfiguration = new ExtractorConfigurationImpl();
export const parHandlerConfiguration = new ParHandlerConfigurationImpl({
  baseHandlerConfiguration,
  extractorConfiguration,
});
export const authorizationIssueHandlerConfiguration =
  new AuthorizationIssueHandlerConfigurationImpl(baseHandlerConfiguration);
export const authorizationFailHandlerConfiguration =
  new AuthorizationFailHandlerConfigurationImpl(baseHandlerConfiguration);
export const authorizationPageHandlerConfiguration =
  new AuthorizationPageHandlerConfigurationImpl();
export const authorizationHandlerConfiguration =
  new AuthorizationHandlerConfigurationImpl({
    baseHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
    authorizationPageHandlerConfiguration,
    extractorConfiguration,
  });
export const userHandlerConfiguration = new UserHandlerConfigurationImpl();
export const authorizationDecisionHandlerConfiguration =
  new AuthorizationDecisionHandlerConfigurationImpl({
    baseHandlerConfiguration,
    extractorConfiguration,
    userHandlerConfiguration,
    authorizationHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
  });
export const tokenCreateHandlerConfiguration =
  new TokenCreateHandlerConfigurationImpl(baseHandlerConfiguration);
export const tokenFailHandlerConfiguration =
  new TokenFailHandlerConfigurationImpl(baseHandlerConfiguration);
export const tokenIssueHandlerConfiguration =
  new TokenIssueHandlerConfigurationImpl(baseHandlerConfiguration);
export const tokenHandlerConfiguration = new TokenHandlerConfigurationImpl({
  baseHandlerConfiguration,
  userHandlerConfiguration,
  tokenFailHandlerConfiguration,
  tokenIssueHandlerConfiguration,
  tokenCreateHandlerConfiguration,
  extractorConfiguration,
});
export const introspectionHandlerConfiguration =
  new IntrospectionHandlerConfigurationImpl(baseHandlerConfiguration);
export const serviceConfigurationHandlerConfiguration =
  new ServiceConfigurationHandlerConfigurationImpl(baseHandlerConfiguration);
export const credentialMetadataHandlerConfiguration =
  new CredentialMetadataHandlerConfigurationImpl(baseHandlerConfiguration);
export const credentialSingleParseHandlerConfiguration =
  new CredentialSingleParseHandlerConfigurationImpl(baseHandlerConfiguration);
export const commonCredentialHandlerConfiguration =
  new CommonCredentialHandlerConfigurationImpl({
    userHandlerConfiguration,
  });
export const baseCredentialHandlerConfiguration =
  new BaseCredentialHandlerConfigurationImpl({
    credentialMetadataHandlerConfiguration,
  });
export const credentialSingleIssueHandlerConfiguration =
  new CredentialSingleIssueHandlerConfigurationImpl({
    extractorConfiguration,
    baseCredentialHandlerConfiguration,
    introspectionHandlerConfiguration,
    baseHandlerConfiguration,
    credentialSingleParseHandlerConfiguration,
    commonCredentialHandlerConfiguration,
  });
