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

import {
  CredentialSingleIssueRequest,
  CredentialSingleIssueResponse,
} from '@vecrea/au3te-ts-common/schemas.credential-single-issue';
import { ToApiRequest } from '../core/toApiRequest';
import { CredentialApiOptions } from '../credential/types';
import { ApiRequestWithOptions, ApiResponseWithOptions } from '../core/types';
import { ProcessApiRequest } from '../core/processApiRequest';
import { ProcessApiResponse } from '../core/processApiResponse';
import { HandleWithOptions } from '../core/handleWithOptions';
import { ProcessRequest } from '../core/processRequest';

/**
 * Configuration interface for the Credential Single Issue Handler.
 *
 * @interface CredentialSingleIssueHandlerConfiguration
 * @property {string} path - The API endpoint path for the Credential Single Issue.
 * @property {ToApiRequest<ApiRequestWithOptions<CredentialSingleIssueRequest, CredentialApiOptions>>} toApiRequest - Function to convert an HTTP request to a Credential Single Issue API request.
 * @property {ProcessApiRequest<CredentialSingleIssueResponse, CredentialSingleIssueResponse>} processApiRequest - Function to process the API request for Credential Single Issue.
 * @property {ProcessApiResponse<ApiResponseWithOptions<CredentialSingleIssueResponse, CredentialApiOptions>>} processApiResponse - Function to process the API response for Credential Single Issue.
 * @property {HandleWithOptions<CredentialSingleIssueRequest, CredentialApiOptions>} handle - Function to handle API requests with options for Credential Single Issue.
 * @property {ProcessRequest} processRequest - Function to process the request for Credential Single Issue.
 */
export interface CredentialSingleIssueHandlerConfiguration {
  path: string;

  toApiRequest: ToApiRequest<
    ApiRequestWithOptions<CredentialSingleIssueRequest, CredentialApiOptions>
  >;

  processApiRequest: ProcessApiRequest<
    CredentialSingleIssueResponse,
    CredentialSingleIssueResponse
  >;

  processApiResponse: ProcessApiResponse<
    ApiResponseWithOptions<CredentialSingleIssueResponse, CredentialApiOptions>
  >;

  handle: HandleWithOptions<CredentialSingleIssueRequest, CredentialApiOptions>;

  processRequest: ProcessRequest;
}
