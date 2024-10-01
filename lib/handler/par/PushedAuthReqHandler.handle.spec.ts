import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { PushedAuthReqHandler } from './PushedAuthReqHandler';
import { PushedAuthReqRequest } from 'au3te-ts-common/schemas.par';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};
const apiClient = new ApiClientImpl(configuration);
const handler = new PushedAuthReqHandler(apiClient);

const testPushAuthorizationRequest = async () => {
  const request: PushedAuthReqRequest = {
    parameters:
      'scope=org.iso.18013.5.1.mDL+openid&redirect_uri=eudi-openid4ci%3A%2F%2Fauthorize%2F&response_type=code&client_id=tw24.wallet.dentsusoken.com',
  };

  const response = await handler.handle(request);
  //console.log(response);
  const responseBody = await response.json();
  //console.log(responseBody);

  expect(response.status).toBe(201);
  expect(responseBody.expires_in).toBeDefined();
  expect(responseBody.request_uri).toBeDefined();

  //return response;
};

describe('PushedAuthReqHandler.handle', () => {
  it('should successfully handle()', async () => {
    await testPushAuthorizationRequest();
  }, 10000);
});
