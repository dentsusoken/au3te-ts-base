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

import {
  CredentialIssuerMetadataRequest,
  CredentialIssuerMetadataResponse,
} from 'au3te-ts-common/schemas.credential-metadata';
import { ProcessApiRequestWithValidation } from '../processApiRequestWithValidation';

/**
 * Type definition for a function that retrieves the configured value of the credential issuer's endpoint.
 * This value is used as the expected value of the `htu` claim in the DPoP proof JWT.
 *
 * @param dpop - A DPoP proof JWT specified by the DPoP HTTP header
 * @param endpointName - The name of an endpoint, such as "credential_endpoint"
 * @returns The configured value of the endpoint. Returns undefined if dpop is undefined
 */
export type ComputeHtu = (
  dpop: string | undefined,
  endpointName: string
) => Promise<string | undefined>;

/**
 * Type definition for parameters required to create a ComputeHtu function
 */
type CreateComputeHtuParams = {
  processCredentialIssuerMetadataRequestWithValidation: ProcessApiRequestWithValidation<
    CredentialIssuerMetadataRequest,
    CredentialIssuerMetadataResponse
  >;
};

/**
 * Creates a function to compute the endpoint value of the credential issuer.
 *
 * When dpop is not provided, this function returns undefined.
 * Otherwise, it calls the /vci/metadata API to get the credential issuer metadata
 * and extracts the value of the specified endpoint from the metadata.
 *
 * @param params - Parameters required to create the function
 * @returns A ComputeHtu function
 */
export const createComputeHtu = ({
  processCredentialIssuerMetadataRequestWithValidation,
}: CreateComputeHtuParams): ComputeHtu => {
  return async (dpop: string | undefined, endpointName: string) => {
    if (!dpop) {
      return undefined;
    }

    const apiRequest: CredentialIssuerMetadataRequest = {};
    const apiResponse =
      await processCredentialIssuerMetadataRequestWithValidation(apiRequest);
    const { responseContent } = apiResponse;
    const jsonObject = JSON.parse(responseContent!);

    return jsonObject[endpointName];
  };
};
