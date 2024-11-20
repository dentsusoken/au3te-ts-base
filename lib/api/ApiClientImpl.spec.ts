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
import {
  IntrospectionRequest,
  introspectionResponseSchema,
} from 'au3te-ts-common/schemas.introspection';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};
const apiClient = new ApiClientImpl(configuration);

const testPar = async () => {
  const request: PushedAuthReqRequest = {
    parameters: new URLSearchParams({
      scope: 'org.iso.18013.5.1.mDL openid',
      redirect_uri: 'eudi-openid4ci://authorize/',
      response_type: 'code',
      client_id: 'tw24.wallet.dentsusoken.com',
    }).toString(),
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
    parameters: new URLSearchParams({
      client_id: 'tw24.wallet.dentsusoken.com',
      request_uri: requestUri,
    }).toString(),
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

const testIntrospection = async (accessToken: string) => {
  const request: IntrospectionRequest = {
    token: accessToken,
  };

  const response = await apiClient.callPostApi(
    apiClient.introspectionPath,
    introspectionResponseSchema,
    request
  );
  //console.log(response);

  expect(response).toBeDefined();
  // expect(response.resultCode).toBe('A050001');
  expect(response.action).toBe('OK');
  // expect(response.accessToken).toBeDefined();

  // return response.accessToken!;
};

describe('ApiClientImpl', () => {
  describe('par', () => {
    it('should successfully push an authorization request', async () => {
      await testPar();
    }, 10000);
  });

  describe('authorization', () => {
    it('should successfully post an authorization', async () => {
      const requestUri = await testPar();
      await testAuthorization(requestUri);
    }, 10000);
  });

  describe('authorizationFail', () => {
    it('should successfully post an authorization fail', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      await testAuthorizationFail(ticket);
    }, 10000);
  });

  describe('authorizationIssue', () => {
    it('should successfully post an authorization issue', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      await testAuthorizationIssue(ticket);
    }, 10000);
  });

  describe('token', () => {
    it('should successfully process a token request', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      const code = await testAuthorizationIssue(ticket);
      await testToken(code);
    }, 10000);
  });

  describe('introspection', () => {
    it('should successfully work for introspection', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      const code = await testAuthorizationIssue(ticket);
      const accessToken = await testToken(code);
      await testIntrospection(accessToken);
    }, 10000);
  });
});
