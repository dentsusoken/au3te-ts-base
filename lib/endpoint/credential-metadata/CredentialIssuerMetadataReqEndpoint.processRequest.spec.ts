import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { CredentialIssuerMetadataReqEndpoint } from './CredentialIssuerMetadataReqEndpoint';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};
const apiClient = new ApiClientImpl(configuration);
const endpoint = new CredentialIssuerMetadataReqEndpoint(apiClient);

const testCredentialIssuerMetadataRequest = async () => {
  const query = new URLSearchParams({
    pretty: 'true',
  }).toString();
  //console.log('body:', body);

  const request = new Request(`http://localhost?${query}`, {
    method: 'GET',
  });

  const response = await endpoint.processRequest(request);
  //console.log(response);
  const resBody = await response.json();
  // console.log(resBody);

  expect(response.status).toBe(200);
  expect(resBody.credential_issuer).toBeDefined();

  //return response;
};

describe('CredentialIssuerMetadataReqEndpoint.processRequest', () => {
  it('should successfully processRequest()', async () => {
    await testCredentialIssuerMetadataRequest();
  }, 10000);
});
