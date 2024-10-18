import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { CredentialIssuerMetadataReqHandler } from './CredentialIssuerMetadataReqHandler';
import { CredentialIssuerMetadataRequest } from 'au3te-ts-common/schemas.credential.metadata';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};

const apiClient = new ApiClientImpl(configuration);
const handler = new CredentialIssuerMetadataReqHandler(apiClient);

const testCredentialIssuerMetadataRequest = async () => {
  const request: CredentialIssuerMetadataRequest = {
    pretty: true,
  };

  const response = await handler.handle(request);
  //console.log(response);
  const responseBody = await response.json();
  //console.log(responseBody);

  expect(response.status).toBe(200);
  expect(responseBody.credential_issuer).toBeDefined();

  //return response;
};

describe('CredentialIssuerMetadataReqHandler.handle', () => {
  it('should successfully handle()', async () => {
    await testCredentialIssuerMetadataRequest();
  }, 10000);
});
