import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import {
  PushedAuthReqRequest,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { AuthorizationFailHandlerConfigurationImpl } from './AuthorizationFailHandlerConfigurationImpl';
import { BaseHandlerConfigurationImpl } from '../BaseHandlerConfigurationImpl';
import {
  AuthorizationRequest,
  authorizationResponseSchema,
} from 'au3te-ts-common/schemas.authorization';
import { AuthorizationFailRequest } from 'au3te-ts-common/schemas.authorization-fail';

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
const config = new AuthorizationFailHandlerConfigurationImpl(
  baseHandlerConfiguration
);

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

const testAuthorization = async (requestUri: string): Promise<string> => {
  const request: AuthorizationRequest = {
    parameters: `client_id=tw24.wallet.dentsusoken.com&request_uri=${encodeURIComponent(
      requestUri!
    )}`,
  };

  const response = await apiClient.callPostApi(
    apiClient.authorizationPath,
    authorizationResponseSchema,
    request
  );

  return response.ticket!;
};

const testAuthorizationFail = async (ticket: string) => {
  const authorizationFailRequest: AuthorizationFailRequest = {
    reason: 'NOT_LOGGED_IN',
    ticket,
  };

  const authorizationFailResponse = await config.handle(
    authorizationFailRequest
  );
  //console.log(authorizationFailResponse);

  expect(authorizationFailResponse.status).toBe(302);
  expect(
    authorizationFailResponse.headers
      .get('Location')
      ?.startsWith('eudi-openid4ci://')
  ).toBe(true);
};

describe('AuthorizationFailHandlerConfigurationImpl.handle', () => {
  it('should successfully handle()', async () => {
    const requestUri = await testPushAuthorizationRequest();
    const ticket = await testAuthorization(requestUri);
    await testAuthorizationFail(ticket);
  }, 10000);
});