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

import { ServiceJwksRequest } from 'au3te-ts-common/schemas.service-jwks';
import { ToApiRequest } from '../toApiRequest';

/**
 * Default implementation to convert an HTTP request to a ServiceConfigurationRequest.
 * Extracts 'pretty' and 'patch' parameters from the URL query string.
 *
 * @param request - The incoming HTTP request
 * @returns A Promise resolving to a ServiceConfigurationRequest object
 */
export const defaultToApiRequest: ToApiRequest<ServiceJwksRequest> = async (
  request: Request
): Promise<ServiceJwksRequest> => {
  const searchParams = new URL(request.url).searchParams;
  const { pretty } =
    searchParams.get('pretty') === 'false'
      ? { pretty: false }
      : { pretty: true };
  const apiRequest: ServiceJwksRequest = { pretty };

  return apiRequest;
};
