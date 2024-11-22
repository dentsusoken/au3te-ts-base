import { ApiClientImpl } from '../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../session/sessionSchemas';
import { InMemorySession } from '../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../handler/BaseHandlerConfigurationImpl';
import { ExtractorConfigurationImpl } from '../extractor/ExtractorConfigurationImpl';
import { ParHandlerConfigurationImpl } from '../handler/par/ParHandlerConfigurationImpl';
import { PushedAuthReqRequest } from 'au3te-ts-common/schemas.par';
import { AuthorizationRequest } from 'au3te-ts-common/schemas.authorization';
import { AuthorizationFailRequest } from 'au3te-ts-common/schemas.authorization-fail';
import { AuthorizationIssueRequest } from 'au3te-ts-common/schemas.authorization-issue';
import { TokenRequest } from 'au3te-ts-common/schemas.token';
import { IntrospectionRequest } from 'au3te-ts-common/schemas.introspection';
import { ServiceConfigurationRequest } from 'au3te-ts-common/schemas.service-configuration';
import { CredentialIssuerMetadataRequest } from 'au3te-ts-common/schemas.credential-metadata';
import { ServiceConfigurationHandlerConfigurationImpl } from '../handler/service-configuration/ServiceConfigurationHandlerConfigurationImpl';
import { CredentialMetadataHandlerConfigurationImpl } from '../handler/credential-metadata/CredentialMetadataHandlerConfigurationImpl';
import { AuthorizationHandlerConfigurationImpl } from '../handler/authorization/AuthorizationHandlerConfigurationImpl';
import { AuthorizationIssueHandlerConfigurationImpl } from '../handler/authorization-issue/AuthorizationIssueHandlerConfigurationImpl';
import { AuthorizationFailHandlerConfigurationImpl } from '../handler/authorization-fail/AuthorizationFailHandlerConfigurationImpl';
import { AuthorizationPageModelConfigurationImpl } from 'au3te-ts-common/page-model.authorization';

export const setupIntegrationTest = () => {
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
  const parHandlerConfiguration = new ParHandlerConfigurationImpl({
    baseHandlerConfiguration,
    extractorConfiguration,
  });
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
      extractorConfiguration,
    });
  const serviceConfigurationHandlerConfiguration =
    new ServiceConfigurationHandlerConfigurationImpl(baseHandlerConfiguration);
  const credentialMetadataHandlerConfiguration =
    new CredentialMetadataHandlerConfigurationImpl(baseHandlerConfiguration);

  const createParParameters = () => {
    return new URLSearchParams({
      scope: 'org.iso.18013.5.1.mDL openid',
      redirect_uri: 'eudi-openid4ci://authorize/',
      response_type: 'code',
      client_id: 'tw24.wallet.dentsusoken.com',
    }).toString();
  };
  const createParRequest = () => {
    const request: PushedAuthReqRequest = {
      parameters: createParParameters(),
    };

    return request;
  };
  const createParPostRequest = () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createParParameters(),
    });

    return request;
  };
  const processParPostRequest = async () => {
    const request = createParPostRequest();
    const response = await parHandlerConfiguration.processRequest(request);
    const body = await response.json();

    return body.request_uri!;
  };

  const createAuthorizationParameters = (requestUri: string) => {
    return new URLSearchParams({
      client_id: 'tw24.wallet.dentsusoken.com',
      request_uri: requestUri,
    }).toString();
  };
  const createAuthorizationRequest = (requestUri: string) => {
    const request: AuthorizationRequest = {
      parameters: createAuthorizationParameters(requestUri),
    };

    return request;
  };
  const createAuthorizationGetRequest = (requestUri: string) => {
    const request = new Request(
      `http://localhost?${createAuthorizationParameters(requestUri)}`
    );

    return request;
  };

  const createAuthorizationFailRequest = (ticket: string) => {
    const request: AuthorizationFailRequest = {
      reason: 'NOT_LOGGED_IN',
      ticket,
    };

    return request;
  };

  const createAuthorizationIssueRequest = (ticket: string) => {
    const request: AuthorizationIssueRequest = {
      ticket,
      subject: '1004',
    };

    return request;
  };

  const createTokenRequest = (code: string) => {
    const request: TokenRequest = {
      parameters: new URLSearchParams({
        code,
        redirect_uri: 'eudi-openid4ci://authorize/',
        grant_type: 'authorization_code',
        client_id: 'tw24.wallet.dentsusoken.com',
      }).toString(),
    };

    return request;
  };

  const createIntrospectionRequest = (accessToken: string) => {
    const request: IntrospectionRequest = {
      token: accessToken,
    };

    return request;
  };

  const createServiceConfigurationRequest = () => {
    const request: ServiceConfigurationRequest = {};

    return request;
  };

  const createCredentialIssuerMetadataRequest = () => {
    const request: CredentialIssuerMetadataRequest = {};

    return request;
  };

  return {
    apiClient,
    session,
    baseHandlerConfiguration,
    extractorConfiguration,
    parHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
    authorizationPageModelConfiguration,
    authorizationHandlerConfiguration,
    serviceConfigurationHandlerConfiguration,
    credentialMetadataHandlerConfiguration,
    createParParameters,
    createParRequest,
    createParPostRequest,
    processParPostRequest,
    createAuthorizationParameters,
    createAuthorizationRequest,
    createAuthorizationGetRequest,
    createAuthorizationFailRequest,
    createAuthorizationIssueRequest,
    createTokenRequest,
    createIntrospectionRequest,
    createServiceConfigurationRequest,
    createCredentialIssuerMetadataRequest,
  };
};
