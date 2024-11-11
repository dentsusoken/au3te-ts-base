import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from './ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import {
  PushedAuthReqRequest,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import { authorizationResponseSchema } from 'au3te-ts-common/schemas.authorization';
import {
  AuthorizationFailRequest,
  authorizationFailResponseSchema,
} from 'au3te-ts-common/schemas.authorization-fail';
import {
  AuthorizationIssueRequest,
  authorizationIssueResponseSchema,
} from 'au3te-ts-common/schemas.authorization-issue';
import {
  TokenRequest,
  tokenResponseSchema,
} from 'au3te-ts-common/schemas.token';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};
const apiClient = new ApiClientImpl(configuration);

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

  expect(response).toBeDefined();
  expect(response.action).toBe('CREATED');
  expect(response.resultCode).toBeDefined();
  expect(response.resultMessage).toBeDefined();
  expect(response.responseContent).toBeDefined();
  expect(response.clientAuthMethod).toBe('none');
  expect(response.requestUri).toBeDefined();
  expect(response.dpopNonce).toBeUndefined();

  return response.requestUri!;
};

const testAuthorization = async (requestUri: string) => {
  const request: PushedAuthReqRequest = {
    parameters: `client_id=tw24.wallet.dentsusoken.com&request_uri=${encodeURIComponent(
      requestUri
    )}`,
  };

  const response = await apiClient.callPostApi(
    apiClient.authorizationPath,
    authorizationResponseSchema,
    request
  );

  expect(response).toBeDefined();
  expect(response.action).toBe('INTERACTION');
  expect(response.service).toBeDefined();
  expect(response.client).toBeDefined();
  expect(response.ticket).toBeDefined();

  return response.ticket!;
};

const testAuthorizationFail = async (ticket: string) => {
  const request: AuthorizationFailRequest = {
    reason: 'NOT_LOGGED_IN',
    ticket: ticket,
  };

  const response = await apiClient.callPostApi(
    apiClient.authorizationFailPath,
    authorizationFailResponseSchema,
    request
  );

  expect(response).toBeDefined();
  expect(response.resultCode).toBe('A060301');
  expect(response.action).toBe('LOCATION');

  return response;
};

const testAuthorizationIssue = async (ticket: string) => {
  const request: AuthorizationIssueRequest = {
    ticket,
    subject: '1004',
  };

  const response = await apiClient.callPostApi(
    apiClient.authorizationIssuePath,
    authorizationIssueResponseSchema,
    request
  );
  console.log(response);

  expect(response).toBeDefined();
  expect(response.resultCode).toBe('A040001');
  expect(response.action).toBe('LOCATION');
  expect(
    response.responseContent?.startsWith('eudi-openid4ci://authorize/?code=')
  ).toBe(true);
  expect(response.authorizationCode).toBeDefined();

  return response.authorizationCode!;
};

const testToken = async (code: string) => {
  const request: TokenRequest = {
    parameters: new URLSearchParams({
      code,
      redirect_uri: 'eudi-openid4ci://authorize/',
      grant_type: 'authorization_code',
      client_id: 'tw24.wallet.dentsusoken.com',
    }).toString(),
  };

  const response = await apiClient.callPostApi(
    apiClient.tokenPath,
    tokenResponseSchema,
    request
  );
  console.log(response);

  expect(response).toBeDefined();
  expect(response.resultCode).toBe('A050001');
  expect(response.action).toBe('OK');
  expect(response.accessToken).toBeDefined();

  return response.accessToken!;
};

describe('AbstractApiClient', () => {
  describe('pushAuthorizationRequest', () => {
    it('should successfully push an authorization request', async () => {
      await testPushAuthorizationRequest();
    }, 10000);
  });

  describe('authorization', () => {
    it('should successfully post an authorization', async () => {
      const requestUri = await testPushAuthorizationRequest();
      await testAuthorization(requestUri);
    }, 10000);
  });

  describe('authorizationFail', () => {
    it('should successfully post an authorization fail', async () => {
      const requestUri = await testPushAuthorizationRequest();
      const ticket = await testAuthorization(requestUri);
      await testAuthorizationFail(ticket);
    }, 10000);
  });

  describe('authorizationIssue', () => {
    it('should successfully post an authorization issue', async () => {
      const requestUri = await testPushAuthorizationRequest();
      const ticket = await testAuthorization(requestUri);
      await testAuthorizationIssue(ticket);
    }, 10000);
  });

  describe('token', () => {
    it('should successfully process a token request', async () => {
      const requestUri = await testPushAuthorizationRequest();
      const ticket = await testAuthorization(requestUri);
      const code = await testAuthorizationIssue(ticket);
      await testToken(code);
    }, 10000);
  });
});
