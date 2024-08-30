import { describe, it, expect, beforeAll } from 'vitest';
import { AuthleteApiImpl } from './AuthleteApiImpl';
import { AuthleteConfiguration } from '../conf';
import { PushedAuthReqRequest } from 'au3te-ts-common';

describe('AuthleteApiImpl', () => {
  let authleteApi: AuthleteApiImpl;

  beforeAll(() => {
    const configuration: AuthleteConfiguration = {
      apiVersion: process.env.API_VERSION || '',
      baseUrl: process.env.API_BASE_URL || '',
      serviceApiKey: process.env.API_KEY || '',
      serviceAccessToken: process.env.ACCESS_TOKEN || '',
    };
    authleteApi = new AuthleteApiImpl(configuration);
  });

  describe('pushAuthorizationRequest', () => {
    it('should successfully push an authorization request', async () => {
      const request: PushedAuthReqRequest = {
        parameters:
          'scope=org.iso.18013.5.1.mDL+openid&redirect_uri=eudi-openid4ci%3A%2F%2Fauthorize%2F&response_type=code&client_id=tw24.wallet.dentsusoken.com',
      };

      const response = await authleteApi.pushAuthorizationRequest(request);

      expect(response).toBeDefined();
      expect(response.action).toBe('CREATED');
      expect(response.resultCode).toBeDefined();
      expect(response.resultMessage).toBeDefined();
      expect(response.responseContent).toBeDefined();
      expect(response.clientAuthMethod).toBe('none');
      expect(response.requestUri).toBeDefined();
      expect(response.dpopNonce).toBeNull();
    }, 10000);

    it('should handle invalid request', async () => {
      const invalidRequest: PushedAuthReqRequest = {
        parameters: 'invalid_parameter=value',
      };

      const response = await authleteApi.pushAuthorizationRequest(
        invalidRequest
      );

      expect(response).toBeDefined();
      expect(response.action).toBe('UNAUTHORIZED');
      expect(response.resultCode).toBeDefined();
      expect(response.resultMessage).toBeDefined();
      expect(response.responseContent).toBeDefined();
      expect(response.clientAuthMethod).toBeNull();
      expect(response.requestUri).toBeNull();
      expect(response.dpopNonce).toBeNull();
    }, 10000);
  });
});
