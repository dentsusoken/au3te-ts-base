import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from './ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import {
  PushedAuthReqRequest,
  PushedAuthReqResponse,
  pushedAuthReqResponseSchema,
} from 'au3te-ts-common/schemas.par';
import {
  AuthorizationResponse,
  authorizationResponseSchema,
} from 'au3te-ts-common/schemas.authorization';
import {
  AuthorizationFailRequest,
  AuthorizationFailResponse,
  authorizationFailResponseSchema,
} from 'au3te-ts-common/schemas.authorization.fail';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};
const apiClient = new ApiClientImpl(configuration);

const testPushAuthorizationRequest =
  async (): Promise<PushedAuthReqResponse> => {
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

    return response;
  };

const testAuthorization = async (
  parResponse: PushedAuthReqResponse
): Promise<AuthorizationResponse> => {
  const authorizationRequest: PushedAuthReqRequest = {
    parameters: `client_id=tw24.wallet.dentsusoken.com&request_uri=${encodeURIComponent(
      parResponse.requestUri!
    )}`,
  };

  const authorizationResponse = await apiClient.callPostApi(
    apiClient.authorizationPath,
    authorizationResponseSchema,
    authorizationRequest
  );

  expect(authorizationResponse).toBeDefined();
  expect(authorizationResponse.action).toBe('INTERACTION');
  expect(authorizationResponse.service).toBeDefined();
  expect(authorizationResponse.client).toBeDefined();
  expect(authorizationResponse.ticket).toBeDefined();

  return authorizationResponse;
};

const testAuthorizationFail = async (
  authorizationResponse: AuthorizationResponse
): Promise<AuthorizationFailResponse> => {
  const authorizationFailRequest: AuthorizationFailRequest = {
    reason: 'NOT_LOGGED_IN',
    ticket: authorizationResponse.ticket,
  };

  const authorizationFailResponse = await apiClient.callPostApi(
    apiClient.authorizationFailPath,
    authorizationFailResponseSchema,
    authorizationFailRequest
  );

  expect(authorizationFailResponse).toBeDefined();
  expect(authorizationFailResponse.resultCode).toBe('A060301');
  expect(authorizationFailResponse.action).toBe('LOCATION');

  return authorizationFailResponse;
};

describe('AbstractApiClient', () => {
  describe('pushAuthorizationRequest', () => {
    it('should successfully push an authorization request', async () => {
      await testPushAuthorizationRequest();
    }, 10000);
  });

  describe('authorization', () => {
    it('should successfully post an authorization', async () => {
      const parResponse = await testPushAuthorizationRequest();
      await testAuthorization(parResponse);
    }, 10000);
  });

  describe('authorizationFail', () => {
    it('should successfully post an authorization fail', async () => {
      const parResponse = await testPushAuthorizationRequest();
      const authorizationResponse = await testAuthorization(parResponse);
      await testAuthorizationFail(authorizationResponse);
    }, 10000);
  });
});
