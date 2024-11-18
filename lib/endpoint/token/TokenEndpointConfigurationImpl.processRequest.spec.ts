import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../../handler/BaseHandlerConfigurationImpl';
import { ExtractorConfigurationImpl } from '../../extractor/ExtractorConfigurationImpl';
import { TokenEndpointConfigurationImpl } from './TokenEndpointConfigurationImpl';
import { TokenFailHandlerConfigurationImpl } from '../../handler/token-fail/TokenFailHandlerConfigurationImpl';
import { TokenIssueHandlerConfigurationImpl } from '../../handler/token-issue/TokenIssueHandlerConfigurationImpl';
import { TokenCreateHandlerConfigurationImpl } from '../../handler/token-create/TokenCreateHandlerConfigurationImpl';
import { UserConfigurationImpl } from 'au3te-ts-common/user';
import {
  PushedAuthReqRequest,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import {
  AuthorizationRequest,
  authorizationResponseSchema,
} from 'au3te-ts-common/schemas.authorization';
import {
  AuthorizationIssueRequest,
  authorizationIssueResponseSchema,
} from 'au3te-ts-common/schemas.authorization-issue';

describe('TokenEndpointConfiguration.processRequest', () => {
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
  const extractorConfiguration = new ExtractorConfigurationImpl();
  const userConfiguration = new UserConfigurationImpl();
  const tokenFailHandlerConfiguration = new TokenFailHandlerConfigurationImpl(
    baseHandlerConfiguration
  );
  const tokenIssueHandlerConfiguration = new TokenIssueHandlerConfigurationImpl(
    baseHandlerConfiguration
  );
  const tokenCreateHandlerConfiguration =
    new TokenCreateHandlerConfigurationImpl(baseHandlerConfiguration);

  const tokenEndpointConfiguration = new TokenEndpointConfigurationImpl({
    baseHandlerConfiguration,
    extractorConfiguration,
    userConfiguration,
    tokenFailHandlerConfiguration,
    tokenIssueHandlerConfiguration,
    tokenCreateHandlerConfiguration,
  });

  const testPar = async () => {
    const params = new URLSearchParams({
      scope: 'org.iso.18013.5.1.mDL openid',
      redirect_uri: 'eudi-openid4ci://authorize/',
      response_type: 'code',
      client_id: 'tw24.wallet.dentsusoken.com',
    });

    const request: PushedAuthReqRequest = {
      parameters: params.toString(),
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
    const params = new URLSearchParams({
      client_id: 'tw24.wallet.dentsusoken.com',
      request_uri: requestUri,
    });

    const request: AuthorizationRequest = {
      parameters: params.toString(),
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

    expect(response).toBeDefined();
    expect(response.action).toBe('LOCATION');
    expect(
      response.responseContent?.startsWith('eudi-openid4ci://authorize/?code=')
    ).toBe(true);
    expect(response.authorizationCode).toBeDefined();

    return response.authorizationCode!;
  };

  const testToken = async (code: string) => {
    const formData = new URLSearchParams({
      code,
      redirect_uri: 'eudi-openid4ci://authorize/',
      grant_type: 'authorization_code',
      client_id: 'tw24.wallet.dentsusoken.com',
    });

    const request = new Request('http://localhost/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const response = await tokenEndpointConfiguration.processRequest(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.access_token).toBeDefined();
  };

  it('should successfully process token request', async () => {
    const requestUri = await testPar();
    const ticket = await testAuthorization(requestUri);
    const code = await testAuthorizationIssue(ticket);
    await testToken(code);
  }, 10000);
});
