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

import * as responseFactory from './responseFactory';

/**
 * Parameters for preparing response headers.
 */
type PrepareHeadersParams = {
  /** DPoP nonce value to be included in the response headers if present */
  dpopNonce: string | undefined | null;
};

/**
 * Function type for preparing response headers.
 * @param params Parameters containing optional DPoP nonce
 * @returns Response headers object
 */
export type PrepareHeaders = ({
  dpopNonce,
}: PrepareHeadersParams) => responseFactory.Headers;

/**
 * Default implementation for preparing response headers.
 * Adds DPoP-Nonce header if a nonce value is provided.
 *
 * @param dpopNonce Optional DPoP nonce value
 * @returns Response headers object with optional DPoP-Nonce header
 */
export const defaultPrepareHeaders: PrepareHeaders = ({
  dpopNonce,
}): responseFactory.Headers => {
  const headers = {} as responseFactory.Headers;

  if (dpopNonce) {
    headers['DPoP-Nonce'] = dpopNonce;
  }

  return headers;
};
