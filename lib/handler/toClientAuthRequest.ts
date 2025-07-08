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

import { BaseClientAuthRequest } from '@vecrea/au3te-ts-common/schemas.common';
import { ExtractParameters } from '../extractor/extractParameters';
import { ExtractClientCredentials } from '../extractor/extractClientCredentials';
import { ExtractClientCertificateAndPath } from '../extractor/extractClientCertificateAndPath';
import { ToApiRequest } from './toApiRequest';

/**
 * Parameters required to create a PAR API request converter.
 *
 * @interface CreateToApiRequestParams
 * @property {ExtractParameters} extractParameters - Function to extract request parameters
 * @property {ExtractClientCredentials} extractClientCredentials - Function to extract client credentials
 * @property {ExtractClientCertificateAndPath} extractClientCertificateAndPath - Function to extract client certificate and path
 */
type CreateToApiRequestParams = {
  extractParameters: ExtractParameters;
  extractClientCredentials: ExtractClientCredentials;
  extractClientCertificateAndPath: ExtractClientCertificateAndPath;
};

/**
 * Creates a function that converts an HTTP request to a Pushed Authorization Request API request.
 *
 * @function createToApiRequest
 * @param {CreateToApiRequestParams} params - The parameter extraction functions
 * @returns {ToApiRequest<PushedAuthReqRequest>} A function that converts Request to PushedAuthReqRequest
 */
export const createToApiRequest =
  <T extends BaseClientAuthRequest>({
    extractParameters,
    extractClientCredentials,
    extractClientCertificateAndPath,
  }: CreateToApiRequestParams): ToApiRequest<T> =>
  async (request: Request): Promise<T> => {
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

    const apiRequest = {
      parameters,
      clientId,
      clientSecret,
      clientCertificate,
      clientCertificatePath,
      dpop,
      htm,
      oauthClientAttestation,
      oauthClientAttestationPop,
    } as T;

    return apiRequest;
  };
