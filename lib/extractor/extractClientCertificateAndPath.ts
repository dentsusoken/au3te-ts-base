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

/**
 * Represents the client certificate and its path.
 * @typedef {Object} ClientCertificateAndPath
 * @property {string|undefined} clientCertificate - The client certificate string, if available.
 * @property {string[]|undefined} clientCertificatePath - The path of the client certificate as an array of strings, if available.
 */
export type ClientCertificateAndPath = {
  clientCertificate: string | undefined;
  clientCertificatePath: string[] | undefined;
};

/**
 * An object representing empty client certificate and path.
 * @type {ClientCertificateAndPath}
 */
const emptyClientCertificateAndPath: ClientCertificateAndPath = {
  clientCertificate: undefined,
  clientCertificatePath: undefined,
};

/**
 * Represents a function that extracts client certificate and path from a Request object.
 * @typedef {Function} ExtractClientCertificateAndPath
 * @async
 * @param {Request} request - The Request object from which to extract the client certificate and path.
 * @returns {Promise<ClientCertificateAndPath>} A promise that resolves to a ClientCertificateAndPath object.
 */
export type ExtractClientCertificateAndPath = (
  request: Request
) => Promise<ClientCertificateAndPath>;

/**
 * Default implementation of ExtractClientCertificateAndPath.
 * This function always returns an empty ClientCertificateAndPath object.
 *
 * @type {ExtractClientCertificateAndPath}
 * @async
 * @param {Request} _request - The Request object (unused in this implementation).
 * @returns {Promise<ClientCertificateAndPath>} A promise that resolves to an empty ClientCertificateAndPath object.
 *
 * @example
 * const request = new Request('https://example.com');
 * const result = await defaultExtractClientCertificateAndPath(request);
 * // result will be { clientCertificate: undefined, clientCertificatePath: undefined }
 */
export const defaultExtractClientCertificateAndPath: ExtractClientCertificateAndPath =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_request: Request): Promise<ClientCertificateAndPath> => {
    return { ...emptyClientCertificateAndPath };
  };
