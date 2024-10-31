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
import { ProcessRequest } from '../processRequest';
import { ToApiRequest } from '../toApiRequest';

/**
 * Interface defining the configuration for the credential metadata endpoint.
 * This endpoint handles requests related to credential metadata.
 */
export interface CredentialMetadataEndpointConfiguration {
  /**
   * Function to convert an HTTP request to a CredentialIssuerMetadataRequest.
   */
  toApiRequest: ToApiRequest<CredentialIssuerMetadataRequest>;

  /**
   * Function to process incoming HTTP requests to the credential metadata endpoint.
   * Takes a Request object and returns a Promise resolving to a Response.
   */
  processRequest: ProcessRequest;
}
