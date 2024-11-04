import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../../handler/BaseHandlerConfigurationImpl';
import { ExtractorConfigurationImpl } from '../../extractor/ExtractorConfigurationImpl';
import { AuthorizationDecisionEndpointConfigurationImpl } from './AuthorizationDecisionEndpointConfigurationImpl';
import {
  PushedAuthReqRequest,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import { AuthorizationRequest } from 'au3te-ts-common/schemas.authorization';
import { AuthorizationIssueHandlerConfigurationImpl } from '../../handler/authorization-issue/AuthorizationIssueHandlerConfigurationImpl';
import { AuthorizationFailHandlerConfigurationImpl } from '../../handler/authorization-fail/AuthorizationFailHandlerConfigurationImpl';
import { AuthorizationPageModelConfigurationImpl } from 'au3te-ts-common/page-model.authorization';
import { AuthorizationHandlerConfigurationImpl } from '../../handler/authorization/AuthorizationHandlerConfigurationImpl';
import { UserConfigurationImpl } from 'au3te-ts-common/user';

describe('AuthorizationDecisionEndpointConfiguration.processRequest', () => {
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

  const authorizationIssueHandlerConfiguration =
    new AuthorizationIssueHandlerConfigurationImpl(baseHandlerConfiguration);
  const authorizationFailHandlerConfiguration =
    new AuthorizationFailHandlerConfigurationImpl(baseHandlerConfiguration);
  const authorizationPageModelConfiguration =
    new AuthorizationPageModelConfigurationImpl();

  const authorizationHandlerConfiguration =
    new AuthorizationHandlerConfigurationImpl({
      baseHandlerConfiguration,
      authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration,
      authorizationPageModelConfiguration,
    });

  const endpointConfiguration =
    new AuthorizationDecisionEndpointConfigurationImpl({
      baseHandlerConfiguration,
      extractorConfiguration,
      userConfiguration,
      authorizationHandlerConfiguration,
      authorizationIssueHandlerConfiguration,
    });

  const decisionRequestParams = new URLSearchParams({
    authorized: 'true',
    loginId: 'inga',
    password: 'inga',
  });

  const decisionGetRequest = new Request(
    `http://localhost/authorize/decision?${decisionRequestParams.toString()}`,
    {
      method: 'GET',
    }
  );

  const decisionPostRequest = new Request(
    'http://localhost/authorize/decision',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: decisionRequestParams.toString(),
    }
  );

  const testPushAuthorizationRequest = async (): Promise<string> => {
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

    return response.requestUri!;
  };

  const testAuthorization = async (requestUri: string) => {
    const request: AuthorizationRequest = {
      parameters: `client_id=tw24.wallet.dentsusoken.com&request_uri=${encodeURIComponent(
        requestUri
      )}`,
    };

    const response = await authorizationHandlerConfiguration.handle(request);
    expect(response.status).toBe(200);
  };

  const testAuthorizationDecision = async (request: Request) => {
    const response = await endpointConfiguration.processRequest(request);
    console.log(response);
    console.log(await response.text());
    expect(response.status).toBe(302);
    const locationHeader = response.headers.get('Location');
    expect(locationHeader).toBeDefined();
    if (!locationHeader?.startsWith('eudi-openid4ci://authorize/?code=')) {
      throw new Error(
        `Expected Location header to start with 'eudi-openid4ci://authorize/?code=' but got '${locationHeader}'`
      );
    }
  };

  it('should successfully process GET authorization decision request', async () => {
    const requestUri = await testPushAuthorizationRequest();
    await testAuthorization(requestUri);
    await testAuthorizationDecision(decisionGetRequest);
  }, 10000);

  it('should successfully process POST authorization decision request', async () => {
    const requestUri = await testPushAuthorizationRequest();
    await testAuthorization(requestUri);
    await testAuthorizationDecision(decisionPostRequest);
  }, 10000);
});
