import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../BaseHandlerConfigurationImpl';
import { TokenHandlerConfigurationImpl } from './TokenHandlerConfigurationImpl';
import { TokenFailHandlerConfigurationImpl } from '../token-fail/TokenFailHandlerConfigurationImpl';
import { TokenIssueHandlerConfigurationImpl } from '../token-issue/TokenIssueHandlerConfigurationImpl';
import { TokenCreateHandlerConfigurationImpl } from '../token-create/TokenCreateHandlerConfigurationImpl';
import { UserConfigurationImpl } from 'au3te-ts-common/user';
import {
  PushedAuthReqRequest,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import { authorizationResponseSchema } from 'au3te-ts-common/schemas.authorization';
import { TokenRequest } from 'au3te-ts-common/schemas.token';
import {
  AuthorizationIssueRequest,
  authorizationIssueResponseSchema,
} from 'au3te-ts-common/schemas.authorization-issue';

describe('TokenHandlerConfigurationImpl.handle', () => {
  const configuration: AuthleteConfiguration = {
    apiVersion: process.env.API_VERSION || '',
    baseUrl: process.env.API_BASE_URL || '',
    serviceApiKey: process.env.API_KEY || '',
    serviceAccessToken: process.env.ACCESS_TOKEN || '',
  };

  const apiClient = new ApiClientImpl(configuration);
  const session = new InMemorySession(sessionSchemas);
  const baseHandlerConfiguration = new BaseHandlerConfigurationImpl(
    apiClient,
    session
  );
  const userConfiguration = new UserConfigurationImpl();
  const tokenFailHandlerConfiguration = new TokenFailHandlerConfigurationImpl(
    baseHandlerConfiguration
  );
  const tokenIssueHandlerConfiguration = new TokenIssueHandlerConfigurationImpl(
    baseHandlerConfiguration
  );
  const tokenCreateHandlerConfiguration =
    new TokenCreateHandlerConfigurationImpl(baseHandlerConfiguration);
  const tokenHandlerConfiguration = new TokenHandlerConfigurationImpl({
    baseHandlerConfiguration,
    userConfiguration,
    tokenFailHandlerConfiguration,
    tokenIssueHandlerConfiguration,
    tokenCreateHandlerConfiguration,
  });

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

    const response = await tokenHandlerConfiguration.handle(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.access_token).toBeDefined();
  };

  it('should successfully handle()', async () => {
    const requestUri = await testPushAuthorizationRequest();
    const ticket = await testAuthorization(requestUri);
    const code = await testAuthorizationIssue(ticket);
    await testToken(code);
  }, 10000);
});
