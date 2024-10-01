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

import {
  ExtractParameters,
  defaultExtractParameters,
} from '../extractor/extractParameters';
import {
  ExtractClientCredentials,
  defaultExtractClientCredentials,
} from '../extractor/extractClientCredentials';
import {
  ExtractClientCertificateAndPath,
  defaultExtractClientCertificateAndPath,
} from '../extractor/extractClientCertificateAndPath';

export type BaseEndpointConstructorOptions = {
  extractParameters?: ExtractParameters;
  extractClientCredentials?: ExtractClientCredentials;
  extractClientCertificateAndPath?: ExtractClientCertificateAndPath;
};

/**
 * Base class for endpoints that handle common operations.
 * @extends CommonEndpoint
 */
export class BaseEndpoint {
  extractParameters: ExtractParameters;
  extractClientCredentials: ExtractClientCredentials;
  extractClientCertificateAndPath: ExtractClientCertificateAndPath;

  constructor(options: BaseEndpointConstructorOptions = {}) {
    this.extractParameters =
      options.extractParameters ?? defaultExtractParameters;
    this.extractClientCredentials =
      options.extractClientCredentials ?? defaultExtractClientCredentials;
    this.extractClientCertificateAndPath =
      options.extractClientCertificateAndPath ??
      defaultExtractClientCertificateAndPath;
  }
}
