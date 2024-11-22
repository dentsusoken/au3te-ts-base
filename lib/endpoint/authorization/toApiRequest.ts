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

import { AuthorizationRequest } from 'au3te-ts-common/schemas.authorization';
import { ExtractParameters } from '../../extractor/extractParameters';
import { ToApiRequest } from '../../handler/toApiRequest';

/**
 * Parameters required to create an authorization API request converter.
 *
 * @interface CreateToApiRequestParams
 * @property {ExtractParameters} extractParameters - Function to extract request parameters
 */
type CreateToApiRequestParams = {
  extractParameters: ExtractParameters;
};

/**
 * Creates a function that converts an HTTP request to an Authorization API request.
 *
 * @function createToApiRequest
 * @param {CreateToApiRequestParams} params - The parameter extraction function
 * @returns {ToApiRequest<AuthorizationRequest>} A function that converts Request to AuthorizationRequest
 */
export const createToApiRequest =
  ({
    extractParameters,
  }: CreateToApiRequestParams): ToApiRequest<AuthorizationRequest> =>
  async (request: Request): Promise<AuthorizationRequest> => {
    const parameters = await extractParameters(request);

    const apiRequest: AuthorizationRequest = {
      parameters,
    };

    return apiRequest;
  };
