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

import { PushedAuthReqRequest } from 'au3te-ts-common/schemas.par';
import { ExtractParameters } from '../../extractor/extractParameters';
import { ExtractClientCredentials } from '../../extractor/extractClientCredentials';
import { ExtractClientCertificateAndPath } from '../../extractor/extractClientCertificateAndPath';

/**
 * Represents a function that converts a Request to a PushedAuthReqRequest.
 *
 * @typedef {Function} ToApiRequest
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<PushedAuthReqRequest>} A promise that resolves to a PushedAuthReqRequest object.
 */
export type ToApiRequest = (request: Request) => Promise<PushedAuthReqRequest>;

export type CreateToApiRequestParams = {
  extractParameters: ExtractParameters;
  extractClientCredentials: ExtractClientCredentials;
  extractClientCertificateAndPath: ExtractClientCertificateAndPath;
};

export const createToApiRequest =
  ({
    extractParameters,
    extractClientCredentials,
    extractClientCertificateAndPath,
  }: CreateToApiRequestParams): ToApiRequest =>
  async (request: Request): Promise<PushedAuthReqRequest> => {
    const parameters = await extractParameters(request);
    const { clientId, clientSecret } = await extractClientCredentials(request);
    const { clientCertificate, clientCertificatePath } =
      await extractClientCertificateAndPath(request);
    const dpop = request.headers.get('DPoP');
    const htm = 'POST';
    const oauthClientAttestation = request.headers.get(
      'OAuth-Client-Attestation'
    );
    const oauthClientAttestationPop = request.headers.get(
      'OAuth-Client-Attestation-PoP'
    );

    const apiRequest: PushedAuthReqRequest = {
      parameters,
      clientId,
      clientSecret,
      clientCertificate,
      clientCertificatePath,
      dpop,
      htm,
      oauthClientAttestation,
      oauthClientAttestationPop,
    };

    return apiRequest;
  };
