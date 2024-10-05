import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { AuthorizationIssueHandler } from './AuthorizationIssueHandler';
import {
  PushedAuthReqRequest,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import { authorizationResponseSchema } from 'au3te-ts-common/schemas.authorization';
import { AuthorizationIssueRequest } from 'au3te-ts-common/schemas.authorization.issue';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};
const apiClient = new ApiClientImpl(configuration);
const handler = new AuthorizationIssueHandler(apiClient);

const testPushAuthorizationRequest = async () => {
  const request: PushedAuthReqRequest = {
    parameters:
      'scope=org.iso.18013.5.1.mDL+openid&redirect_uri=eudi-openid4ci%3A%2F%2Fauthorize%2F&response_type=code&client_id=tw24.wallet.dentsusoken.com',
  };

  const response = await apiClient.callPostApi(
    apiClient.pushAuthorizationRequestPath,
    pushedAuthReqResponseSchema,
    request
  );

  return response.requestUri!;
};

const testAuthorization = async (requestUri: string): Promise<string> => {
  const request: PushedAuthReqRequest = {
    parameters: `client_id=tw24.wallet.dentsusoken.com&request_uri=${encodeURIComponent(
      requestUri!
    )}&prompt=none`,
  };

  const response = await apiClient.callPostApi(
    apiClient.authorizationPath,
    authorizationResponseSchema,
    request
  );
  //console.log(response);

  return response.ticket!;
};

const testAuthorizationIssue = async (ticket: string) => {
  const request: AuthorizationIssueRequest = {
    ticket,
    subject: '1004',
  };

  const response = await handler.handle(request);
  console.log(response);

  expect(response.status).toBe(302);
  expect(
    response.headers.get('Location')?.startsWith('eudi-openid4ci://')
  ).toBe(true);
};

describe('AuthorizationIssueHandler.handle', () => {
  it('should successfully handle()', async () => {
    const requestUri = await testPushAuthorizationRequest();
    const ticket = await testAuthorization(requestUri);
    await testAuthorizationIssue(ticket);
  }, 10000);
});
