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

import { CredentialIssuerJwksRequest } from '@vecrea/au3te-ts-common/schemas.credential-issuer-jwks';
import { ToApiRequest } from '../toApiRequest';

/**
 * Default function to convert an HTTP request to a CredentialIssuerJwksRequest.
 * Extracts query parameters from the request URL and constructs the API request object.
 *
 * @param request - The incoming HTTP request
 * @returns Promise resolving to a CredentialIssuerJwksRequest object
 */
export const defaultToApiRequest: ToApiRequest<
  CredentialIssuerJwksRequest
> = async (request: Request): Promise<CredentialIssuerJwksRequest> => {
  const serachParams = new URL(request.url).searchParams;
  const pretty = !serachParams.get('pretty')
    ? true
    : Boolean(serachParams.get('pretty'));

  const apiRequest: CredentialIssuerJwksRequest = {
    pretty,
  };

  return apiRequest;
};
