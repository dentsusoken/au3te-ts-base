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

import { ServiceConfigurationRequest } from 'au3te-ts-common/schemas.service-configuration';
import { ToApiRequest } from '../toApiRequest';

<<<<<<< HEAD
/**
 * Default implementation to convert an HTTP request to a ServiceConfigurationRequest.
 * Extracts 'pretty' and 'patch' parameters from the URL query string.
 *
 * @param request - The incoming HTTP request
 * @returns A Promise resolving to a ServiceConfigurationRequest object
 */
export const defaultToApiRequest: ToApiRequest<
  ServiceConfigurationRequest
> = async (request: Request): Promise<ServiceConfigurationRequest> => {
  const searchParams = new URL(request.url).searchParams;
  const { pretty, patch } =
    searchParams.get('pretty') === 'true'
      ? { pretty: true, patch: searchParams.get('patch') }
      : { pretty: false, patch: searchParams.get('patch') };
  const apiRequest: ServiceConfigurationRequest = { pretty, patch };
=======
export const createToApiRequest =
  (): ToApiRequest<ServiceConfigurationRequest> =>
  async (request: Request): Promise<ServiceConfigurationRequest> => {
    const searchParams = new URL(request.url).searchParams;
    const pretty = Boolean(searchParams.get('pretty'));
    const patch = searchParams.get('patch');
    const apiRequest: ServiceConfigurationRequest = patch
      ? { pretty, patch }
      : { pretty };
>>>>>>> b9611033fb7e589b20e1900e2d7ea455adbf9b5b

  return apiRequest;
};
