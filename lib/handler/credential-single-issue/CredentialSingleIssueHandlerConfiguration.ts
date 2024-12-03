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
} from 'au3te-ts-common/schemas.credential-single-issue';
import { ToApiRequest } from '../toApiRequest';
import { CredentialApiOptions } from '../credential/types';
import { ApiRequestWithOptions, ApiResponseWithOptions } from '../types';
import { ProcessApiRequest } from '../processApiRequest';
import { ProcessApiResponse } from '../processApiResponse';
import { HandleWithOptions } from '../handleWithOptions';
import { ProcessRequest } from '../processRequest';

/**
 * Configuration interface for the Credential Single Issue Handler.
 *
 * @interface CredentialSingleIssueHandlerConfiguration
 * @property {ToApiRequest<CredentialSingleIssueRequest>} toApiRequest - Function to convert an HTTP request to a Credential Single Issue API request
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
