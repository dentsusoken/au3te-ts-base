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

import { CredentialIssuerMetadataRequest } from 'au3te-ts-common/schemas.credential-metadata';
import { BaseHandlerConfiguration } from '../../handler/BaseHandlerConfiguration';
import { CredentialMetadataHandlerConfigurationImpl } from '../../handler/credential-metadata';
import { SessionSchemas } from '../../session';
import { sessionSchemas } from '../../session/sessionSchemas';
import { createProcessRequest, ProcessRequest } from '../processRequest';
import { CredentialMetadataEndpointConfiguration } from './CredentialMetadataEndpointConfiguration';
import { defaultToApiRequest } from './toApiRequest';
import { ToApiRequest } from '../toApiRequest';

/**
 * Implementation of the CredentialMetadataEndpointConfiguration interface.
 * This class handles configuration for the credential metadata endpoint.
 * @template SS - Type parameter extending SessionSchemas, defaults to the base session schemas
 */
export class CredentialMetadataEndpointConfigurationImpl<
  SS extends SessionSchemas = typeof sessionSchemas
> implements CredentialMetadataEndpointConfiguration
{
  /** Function to convert HTTP requests to CredentialIssuerMetadataRequest objects */
  toApiRequest: ToApiRequest<CredentialIssuerMetadataRequest>;

  /** Function to process incoming HTTP requests */
  processRequest: ProcessRequest;

  /**
   * Creates an instance of CredentialMetadataEndpointConfigurationImpl.
   * @param {BaseHandlerConfiguration<SS>} baseHandlerConfiguration - Base configuration for the handler
   */
  constructor(baseHandlerConfiguration: BaseHandlerConfiguration<SS>) {
    this.toApiRequest = defaultToApiRequest;

    const credentialMetadataHandlerConfiguration =
      new CredentialMetadataHandlerConfigurationImpl(baseHandlerConfiguration);
    this.processRequest = createProcessRequest({
      path: credentialMetadataHandlerConfiguration.path,
      toApiRequest: this.toApiRequest,
      handle: credentialMetadataHandlerConfiguration.handle,
      recoverResponseResult: baseHandlerConfiguration.recoverResponseResult,
    });
  }
}
