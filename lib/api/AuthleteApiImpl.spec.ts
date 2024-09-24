import { describe, it, expect, beforeAll } from 'vitest';
import { AuthleteApiImpl } from './AuthleteApiImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { PushedAuthReqRequest } from 'au3te-ts-common/schemas.par';
import { AuthorizationRequest } from 'au3te-ts-common/schemas.authorization';
import { AuthorizationFailRequest } from 'au3te-ts-common/schemas.authorization.fail';

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
      expect(response.dpopNonce).toBeUndefined();
    }, 10000);
  });

  describe('authorization', () => {
    it('should successfully post an authorization', async () => {
      const parRequest: PushedAuthReqRequest = {
        parameters:
          'scope=org.iso.18013.5.1.mDL+openid&redirect_uri=eudi-openid4ci%3A%2F%2Fauthorize%2F&response_type=code&client_id=tw24.wallet.dentsusoken.com',
      };

      const parResponse = await authleteApi.pushAuthorizationRequest(
        parRequest
      );

      expect(parResponse).toBeDefined();
      expect(parResponse.action).toBe('CREATED');
      expect(parResponse.resultCode).toBeDefined();
      expect(parResponse.resultMessage).toBeDefined();
      expect(parResponse.responseContent).toBeDefined();
      expect(parResponse.clientAuthMethod).toBe('none');
      expect(parResponse.requestUri).toBeDefined();
      expect(parResponse.dpopNonce).toBeUndefined();

      const authorizationRequest: AuthorizationRequest = {
        parameters: `client_id=tw24.wallet.dentsusoken.com&request_uri=${encodeURIComponent(
          parResponse.requestUri!
        )}`,
      };

      const authorizationResponse = await authleteApi.authorization(
        authorizationRequest
      );
      //console.log(authorizationResponse);

      expect(authorizationResponse).toBeDefined();
      expect(authorizationResponse.action).toBe('INTERACTION');
      expect(authorizationResponse.service).toBeDefined();
      expect(authorizationResponse.client).toBeDefined();
      expect(authorizationResponse.ticket).toBeDefined();
    }, 10000);
  });

  describe('authorizationFail', () => {
    it('should successfully post an authorization fail', async () => {
      const parRequest: PushedAuthReqRequest = {
        parameters:
          'scope=org.iso.18013.5.1.mDL+openid&redirect_uri=eudi-openid4ci%3A%2F%2Fauthorize%2F&response_type=code&client_id=tw24.wallet.dentsusoken.com',
      };

      const parResponse = await authleteApi.pushAuthorizationRequest(
        parRequest
      );

      expect(parResponse).toBeDefined();
      expect(parResponse.action).toBe('CREATED');
      expect(parResponse.resultCode).toBeDefined();
      expect(parResponse.resultMessage).toBeDefined();
      expect(parResponse.responseContent).toBeDefined();
      expect(parResponse.clientAuthMethod).toBe('none');
      expect(parResponse.requestUri).toBeDefined();
      expect(parResponse.dpopNonce).toBeUndefined();

      const authorizationRequest: AuthorizationRequest = {
        parameters: `client_id=tw24.wallet.dentsusoken.com&request_uri=${encodeURIComponent(
          parResponse.requestUri!
        )}`,
      };

      const authorizationResponse = await authleteApi.authorization(
        authorizationRequest
      );
      //console.log(authorizationResponse);

      expect(authorizationResponse).toBeDefined();
      expect(authorizationResponse.action).toBe('INTERACTION');
      expect(authorizationResponse.service).toBeDefined();
      expect(authorizationResponse.client).toBeDefined();
      expect(authorizationResponse.ticket).toBeDefined();

      const authorizationFailRequest: AuthorizationFailRequest = {
        reason: 'NOT_LOGGED_IN',
        ticket: authorizationResponse.ticket,
      };

      const authorizationFailResponse = await authleteApi.authorizationFail(
        authorizationFailRequest
      );
      console.log(authorizationFailResponse);

      expect(authorizationFailResponse).toBeDefined();
      expect(authorizationFailResponse.resultCode).toBe('A060301');
      expect(authorizationFailResponse.action).toBe('LOCATION');
    }, 10000);
  });
});
