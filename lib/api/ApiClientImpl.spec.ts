import { describe, it, expect } from 'vitest';
import { pushedAuthReqResponseSchema } from 'au3te-ts-common/schemas.par';
import { authorizationResponseSchema } from 'au3te-ts-common/schemas.authorization';
import { authorizationFailResponseSchema } from 'au3te-ts-common/schemas.authorization-fail';
import { authorizationIssueResponseSchema } from 'au3te-ts-common/schemas.authorization-issue';
import { tokenResponseSchema } from 'au3te-ts-common/schemas.token';
import { introspectionResponseSchema } from 'au3te-ts-common/schemas.introspection';
import { serviceConfigurationResponseSchema } from 'au3te-ts-common/schemas.service-configuration';
import { credentialIssuerMetadataResponseSchema } from 'au3te-ts-common/schemas.credential-metadata';
import { credentialSingleParseResponseSchema } from 'au3te-ts-common/schemas.credential-single-parse';
import { credentialSingleIssueResponseSchema } from 'au3te-ts-common/schemas.credential-single-issue';

import {
  apiClient,
  commonCredentialHandlerConfiguration,
} from '../testing/configurations';
import { createParRequest } from '../testing/par';
import { createAuthorizationRequest } from '../testing/authorization';
import { createAuthorizationFailRequest } from '../testing/authorizationFail';
import { createAuthorizationIssueRequest } from '../testing/authorizationIssue';
import { createTokenRequest } from '../testing/token';
import { createIntrospectionRequest } from '../testing/introspection';
import { createServiceConfigurationRequest } from '../testing/serviceConfiguration';
import { createCredentialIssuerMetadataRequest } from '../testing/credentialIssuerMetadata';
import { createCredentialSingleParseRequest } from '../testing/credentialSingleParse';
import { createCredentialSingleIssueRequest } from '../testing/credentialSingleIssue';

const testPar = async () => {
  const response = await apiClient.callPostApi(
    apiClient.pushAuthorizationRequestPath,
    pushedAuthReqResponseSchema,
    createParRequest()
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
  const response = await apiClient.callPostApi(
    apiClient.authorizationPath,
    authorizationResponseSchema,
    createAuthorizationRequest(requestUri)
  );

  expect(response).toBeDefined();
  expect(response.action).toBe('INTERACTION');
  expect(response.service).toBeDefined();
  expect(response.client).toBeDefined();
  expect(response.ticket).toBeDefined();

  return response.ticket!;
};

const testAuthorizationFail = async (ticket: string) => {
  const response = await apiClient.callPostApi(
    apiClient.authorizationFailPath,
    authorizationFailResponseSchema,
    createAuthorizationFailRequest(ticket)
  );

  expect(response).toBeDefined();
  expect(response.resultCode).toBe('A060301');
  expect(response.action).toBe('LOCATION');
};

const testAuthorizationIssue = async (ticket: string) => {
  const response = await apiClient.callPostApi(
    apiClient.authorizationIssuePath,
    authorizationIssueResponseSchema,
    createAuthorizationIssueRequest(ticket)
  );

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
  const response = await apiClient.callPostApi(
    apiClient.tokenPath,
    tokenResponseSchema,
    createTokenRequest(code)
  );

  expect(response).toBeDefined();
  expect(response.resultCode).toBe('A050001');
  expect(response.action).toBe('OK');
  expect(response.accessToken).toBeDefined();

  return response.accessToken!;
};

const testIntrospection = async (accessToken: string) => {
  const response = await apiClient.callPostApi(
    apiClient.introspectionPath,
    introspectionResponseSchema,
    createIntrospectionRequest(accessToken)
  );
  //console.log(response);

  expect(response).toBeDefined();
  expect(response.action).toBe('OK');

  return response;
};

const testServiceConfiguration = async () => {
  const response = await apiClient.callPostApi(
    apiClient.serviceConfigurationPath,
    serviceConfigurationResponseSchema,
    createServiceConfigurationRequest()
  );

  expect(response).toBeDefined();
  expect(response.issuer).toBeDefined();
};

const testCredentialIssuerMetadata = async () => {
  const response = await apiClient.callPostApi(
    apiClient.credentialIssuerMetadataPath,
    credentialIssuerMetadataResponseSchema,
    createCredentialIssuerMetadataRequest()
  );
  //console.log(response);

  expect(response).toBeDefined();
  expect(response.action).toBe('OK');
};

const testCredentialSingleParse = async (accessToken: string) => {
  const response = await apiClient.callPostApi(
    apiClient.credentialSingleParsePath,
    credentialSingleParseResponseSchema,
    createCredentialSingleParseRequest(accessToken)
  );

  expect(response).toBeDefined();
  expect(response.action).toBe('OK');

  const info = response.info;
  expect(info).toBeDefined();
  expect(info?.identifier).toBeDefined();
  expect(info?.format).toBeDefined();
  expect(info?.details).toBeDefined();

  return info!;
};

const testCredentialSingleIssue = async (accessToken: string) => {
  const introspectionResponse = await testIntrospection(accessToken);
  const credentialRequestInfo = await testCredentialSingleParse(accessToken);
  const toOrder = commonCredentialHandlerConfiguration.getToOrder(
    credentialRequestInfo.format
  );
  const order = await toOrder({
    credentialType: 'single',
    credentialRequestInfo,
    introspectionResponse,
  });
  const response = await apiClient.callPostApi(
    apiClient.credentialSingleIssuePath,
    credentialSingleIssueResponseSchema,
    createCredentialSingleIssueRequest(accessToken, order)
  );
  //console.log(response);

  expect(response).toBeDefined();
  // expect(response.action).toBe('OK');

  // const info = response.info;
  // expect(info).toBeDefined();
  // expect(info?.identifier).toBeDefined();
  // expect(info?.format).toBeDefined();
  // expect(info?.details).toBeDefined();
};

describe('ApiClientImpl', () => {
  describe('par', () => {
    it('should successfully handle a par request', async () => {
      await testPar();
    }, 10000);
  });

  describe('authorization', () => {
    it('should successfully handle an authorization request', async () => {
      const requestUri = await testPar();
      await testAuthorization(requestUri);
    }, 10000);
  });

  describe('authorizationFail', () => {
    it('should successfully handle an authorization fail request', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      await testAuthorizationFail(ticket);
    }, 10000);
  });

  describe('authorizationIssue', () => {
    it('should successfully handle an authorization issue request', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      await testAuthorizationIssue(ticket);
    }, 10000);
  });

  describe('token', () => {
    it('should successfully handle a token request', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      const code = await testAuthorizationIssue(ticket);
      await testToken(code);
    }, 10000);
  });

  describe('introspection', () => {
    it('should successfully handle an introspection request', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      const code = await testAuthorizationIssue(ticket);
      const accessToken = await testToken(code);
      await testIntrospection(accessToken);
    }, 10000);
  });

  describe('serviceConfiguration', () => {
    it('should successfully handle a service configuration request', async () => {
      await testServiceConfiguration();
    }, 10000);
  });

  describe('credentialIssuerMetadata', () => {
    it('should successfully handle a credential issuer metadata request', async () => {
      await testCredentialIssuerMetadata();
    }, 10000);
  });

  describe('credentialSingleParse', () => {
    it('should successfully handle a credential single parse request', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      const code = await testAuthorizationIssue(ticket);
      const accessToken = await testToken(code);
      await testCredentialSingleParse(accessToken);
    }, 10000);
  });

  describe('credentialSingleIssue', () => {
    it('should successfully handle a credential single issue request', async () => {
      const requestUri = await testPar();
      const ticket = await testAuthorization(requestUri);
      const code = await testAuthorizationIssue(ticket);
      const accessToken = await testToken(code);
      await testCredentialSingleIssue(accessToken);
    }, 10000);
  });
});
