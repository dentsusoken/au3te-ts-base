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

import { AuthorizationRequest } from 'au3te-ts-common/schemas.authorization';
import { BaseHandlerConfiguration } from '../../handler/BaseHandlerConfiguration';
import { AuthorizationHandlerConfigurationImpl } from '../../handler/authorization';
import { AuthorizationFailHandlerConfigurationImpl } from '../../handler/authorization-fail';
import { AuthorizationIssueHandlerConfigurationImpl } from '../../handler/authorization-issue';
import { AuthorizationPageModelConfigurationImpl } from 'au3te-ts-common/page-model.authorization';
import { SessionSchemas } from '../../session';
import { sessionSchemas } from '../../session/sessionSchemas';
import { createProcessRequest, ProcessRequest } from '../processRequest';
import { AuthorizationEndpointConfiguration } from './AuthorizationEndpointConfiguration';
import { createToApiRequest } from './toApiRequest';
import { ToApiRequest } from '../toApiRequest';
import { ExtractorConfiguration } from '../../extractor/ExtractorConfiguration';

/**
 * Implementation of the Authorization endpoint configuration.
 * Handles conversion of HTTP requests to Authorization API requests and processes them.
 *
 * @template SS - Type of session schemas, defaults to the standard session schemas
 * @implements {AuthorizationEndpointConfiguration}
 */
export class AuthorizationEndpointConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements AuthorizationEndpointConfiguration
{
  /** Function to convert HTTP requests to Authorization API requests */
  toApiRequest: ToApiRequest<AuthorizationRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates a new Authorization endpoint configuration instance.
   *
   * @param baseHandlerConfiguration - Base configuration for request handling
   * @param extractorConfiguration - Configuration for extracting data from requests
   */
  constructor(
    baseHandlerConfiguration: BaseHandlerConfiguration<SS>,
    extractorConfiguration: ExtractorConfiguration
  ) {
    this.toApiRequest = createToApiRequest({
      extractParameters: extractorConfiguration.extractParameters,
    });

    const authorizationFailHandlerConfiguration =
      new AuthorizationFailHandlerConfigurationImpl(baseHandlerConfiguration);

    const authorizationIssueHandlerConfiguration =
      new AuthorizationIssueHandlerConfigurationImpl(baseHandlerConfiguration);

    const authorizationPageModelConfiguration =
      new AuthorizationPageModelConfigurationImpl();

    const authorizationHandlerConfiguration =
      new AuthorizationHandlerConfigurationImpl({
        baseHandlerConfiguration,
        authorizationIssueHandlerConfiguration,
        authorizationFailHandlerConfiguration,
        authorizationPageModelConfiguration,
      });

    this.processRequest = createProcessRequest({
      toApiRequest: this.toApiRequest,
      handle: authorizationHandlerConfiguration.handle,
    });
  }
}
