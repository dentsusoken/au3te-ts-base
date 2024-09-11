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

import { BaseEndpoint, BaseEndpointConstructorOptions } from '../BaseEndpoint';
import {
  createProcessApiResponse,
  ProcessApiResponse,
} from './processApiResponse';
import {
  defaultProcessApiRequest,
  ProcessApiRequest,
} from './processApiRequest';
import { createToApiRequest, ToApiRequest } from './toApiRequest';
import { createPost, Post } from './post';

export const PAR_PATH = '/api/par';

export type PushedAuthReqEndpointConstructorOptions = {
  processApiResponse?: ProcessApiResponse;
  processApiRequest?: ProcessApiRequest;
  toApiRequest?: ToApiRequest;
  post?: Post;
} & BaseEndpointConstructorOptions;

export class PushedAuthReqEndpoint extends BaseEndpoint {
  processApiResponse: ProcessApiResponse;
  processApiRequest: ProcessApiRequest;
  toApiRequest: ToApiRequest;
  post: Post;

  constructor(options: PushedAuthReqEndpointConstructorOptions = {}) {
    super(PAR_PATH, options);
    this.processApiResponse =
      options.processApiResponse ??
      createProcessApiResponse(this.buildUnknownActionMessage);
    this.processApiRequest =
      options.processApiRequest ?? defaultProcessApiRequest;
    this.toApiRequest =
      options.toApiRequest ??
      createToApiRequest({
        extractParameters: this.extractParameters,
        extractClientCredentials: this.extractClientCredentials,
        extractClientCertificateAndPath: this.extractClientCertificateAndPath,
      });
    this.post =
      options.post ??
      createPost({
        toApiRequest: this.toApiRequest,
        processApiRequest: this.processApiRequest,
        processApiResponse: this.processApiResponse,
        processError: this.processError,
      });
  }
}
