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

import { AuthorizationFailResponse } from 'au3te-ts-common/schemas.authorization.fail';
import * as responseFactory from '../../utils/responseFactory';
import { BuildUnknownActionMessage } from 'au3te-ts-common/handler';
import { ProcessApiResponse } from '../processApiResponse';

export const createProcessApiResponse =
  (
    buildUnknownActionMessage: BuildUnknownActionMessage
  ): ProcessApiResponse<AuthorizationFailResponse> =>
  async (apiResponse: AuthorizationFailResponse): Promise<Response> => {
    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'INTERNAL_SERVER_ERROR':
        return responseFactory.internalServerError(responseContent);
      case 'BAD_REQUEST':
        return responseFactory.badRequest(responseContent);
      case 'LOCATION':
        return responseFactory.location(responseContent!);
      case 'FORM':
        return responseFactory.form(responseContent);
      default:
        return responseFactory.internalServerError(
          buildUnknownActionMessage(action)
        );
    }
  };
