import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { PushedAuthReqEndpoint } from './PushedAuthReqEndpoint';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};
const apiClient = new ApiClientImpl(configuration);
const endpoint = new PushedAuthReqEndpoint(apiClient);

const testPushAuthorizationRequest = async () => {
  const body = new URLSearchParams({
    scope: 'org.iso.18013.5.1.mDL openid',
    redirect_uri: process.env.REDIRECT_URI || '',
    response_type: 'code',
    client_id: process.env.CLIENT_ID || '',
  }).toString();
  //console.log('body:', body);

  const request = new Request('http://localhost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const response = await endpoint.processRequest(request);
  //console.log(response);
  const resBody = await response.json();
  //console.log(resBody);

  expect(response.status).toBe(201);
  expect(resBody.expires_in).toBeDefined();
  expect(resBody.request_uri).toBeDefined();

  //return response;
};

describe('PushedAuthReqEndpoint.processRequest', () => {
  it('should successfully processRequest()', async () => {
    await testPushAuthorizationRequest();
  }, 10000);
});
