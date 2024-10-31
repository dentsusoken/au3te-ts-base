import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import {
  PushedAuthReqRequest,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { AuthorizationIssueHandlerConfigurationImpl } from '../authorization-issue/AuthorizationIssueHandlerConfigurationImpl';
import { AuthorizationFailHandlerConfigurationImpl } from '../authorization-fail/AuthorizationFailHandlerConfigurationImpl';
import { AuthorizationPageModelConfigurationImpl } from 'au3te-ts-common/page-model.authorization';
import { BaseHandlerConfigurationImpl } from '../BaseHandlerConfigurationImpl';
import { AuthorizationRequest } from 'au3te-ts-common/schemas.authorization';
import { AuthorizationHandlerConfigurationImpl } from './AuthorizationHandlerConfigurationImpl';

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

const testPushAuthorizationRequest = async (): Promise<string> => {
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

const testAuthorization = async (requestUri: string): Promise<void> => {
  const request: AuthorizationRequest = {
    parameters: `client_id=tw24.wallet.dentsusoken.com&request_uri=${encodeURIComponent(
      requestUri!
    )}`,
  };

  const response = await authorizationHandlerConfiguration.handle(request);
  //const json = await response.json();
  //console.log(json);

  expect(response.status).toBe(200);
  //expect(json.ticket).toBeDefined();
};

describe('AuthorizationHandlerConfigurationImpl.handle', () => {
  it('should successfully handle()', async () => {
    const requestUri = await testPushAuthorizationRequest();
    await testAuthorization(requestUri);
  }, 10000);
});
