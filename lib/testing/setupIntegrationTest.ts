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
import { AuthorizationPageHandlerConfigurationImpl } from 'au3te-ts-common/handler.authorization-page';
import { AuthorizationDecisionHandlerConfigurationImpl } from '../handler/authorization-decision/AuthorizationDecisionHandlerConfigurationImpl';
import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { TokenHandlerConfigurationImpl } from '../handler/token/TokenHandlerConfigurationImpl';
import { TokenCreateHandlerConfigurationImpl } from '../handler/token-create/TokenCreateHandlerConfigurationImpl';
import { TokenFailHandlerConfigurationImpl } from '../handler/token-fail/TokenFailHandlerConfigurationImpl';
import { TokenIssueHandlerConfigurationImpl } from '../handler/token-issue/TokenIssueHandlerConfigurationImpl';
import { IntrospectionHandlerConfigurationImpl } from '../handler/introspection/IntrospectionHandlerConfigurationImpl';
import { CredentialSingleParseRequest } from 'au3te-ts-common/schemas.credential-single-parse';
import { CredentialSingleParseHandlerConfigurationImpl } from '../handler/credential-single-parse/CredentialSingleParseHandlerConfigurationImpl';

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
  const authorizationPageHandlerConfiguration =
    new AuthorizationPageHandlerConfigurationImpl();
  const authorizationHandlerConfiguration =
    new AuthorizationHandlerConfigurationImpl({
      baseHandlerConfiguration,
      authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration,
      authorizationPageHandlerConfiguration,
      extractorConfiguration,
    });
  const userHandlerConfiguration = new UserHandlerConfigurationImpl();
  const authorizationDecisionHandlerConfiguration =
    new AuthorizationDecisionHandlerConfigurationImpl({
      baseHandlerConfiguration,
      extractorConfiguration,
      userHandlerConfiguration,
      authorizationHandlerConfiguration,
      authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration,
    });
  const tokenCreateHandlerConfiguration =
    new TokenCreateHandlerConfigurationImpl(baseHandlerConfiguration);
  const tokenFailHandlerConfiguration = new TokenFailHandlerConfigurationImpl(
    baseHandlerConfiguration
  );
  const tokenIssueHandlerConfiguration = new TokenIssueHandlerConfigurationImpl(
    baseHandlerConfiguration
  );
  const tokenHandlerConfiguration = new TokenHandlerConfigurationImpl({
    baseHandlerConfiguration,
    userHandlerConfiguration,
    tokenFailHandlerConfiguration,
    tokenIssueHandlerConfiguration,
    tokenCreateHandlerConfiguration,
    extractorConfiguration,
  });
  const introspectionHandlerConfiguration =
    new IntrospectionHandlerConfigurationImpl(baseHandlerConfiguration);
  const serviceConfigurationHandlerConfiguration =
    new ServiceConfigurationHandlerConfigurationImpl(baseHandlerConfiguration);
  const credentialMetadataHandlerConfiguration =
    new CredentialMetadataHandlerConfigurationImpl(baseHandlerConfiguration);
  const credentialSingleParseHandlerConfiguration =
    new CredentialSingleParseHandlerConfigurationImpl(baseHandlerConfiguration);

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
  const processAuthorizationGetRequest = async (requestUri: string) => {
    const request = createAuthorizationGetRequest(requestUri);
    await authorizationHandlerConfiguration.processRequest(request);
    const decisionParams = await session.get('authorizationDecisionParams');

    return decisionParams!.ticket!;
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

  const createAuthorizationDecisionParameters = () => {
    return new URLSearchParams({
      authorized: 'true',
      loginId: 'inga',
      password: 'inga',
    }).toString();
  };
  const createAuthorizationDecisionGetRequest = () => {
    const request = new Request(
      `http://localhost/authorize/decision?${createAuthorizationDecisionParameters()}`,
      {
        method: 'GET',
      }
    );
    return request;
  };
  const createAuthorizationDecisionPostRequest = () => {
    const request = new Request('http://localhost/authorize/decision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createAuthorizationDecisionParameters(),
    });
    return request;
  };
  const processAuthorizationDecisionPostRequest = async () => {
    const request = createAuthorizationDecisionPostRequest();
    const response =
      await authorizationDecisionHandlerConfiguration.processRequest(request);
    const locationHeader = response.headers.get('Location');
    const code = new URL(locationHeader!).searchParams.get('code')!;

    return code;
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
  const createTokenPostRequest = (code: string) => {
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

    return request;
  };
  const processTokenPostRequest = async (code: string) => {
    const request = createTokenPostRequest(code);
    const response = await tokenHandlerConfiguration.processRequest(request);
    const body = await response.json();

    return body.access_token!;
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

  const createCredentialSingleParseRequest = (accessToken: string) => {
    const request: CredentialSingleParseRequest = {
      accessToken,
      requestContent: JSON.stringify({
        format: 'mso_mdoc',
        doctype: 'org.iso.18013.5.1.mDL',
        claims: {
          'org.iso.18013.5.1': {
            family_name: {},
            given_name: {},
            birth_date: {},
            issue_date: {},
            expiry_date: {},
            issuing_country: {},
            document_number: {},
            driving_privileges: {},
          },
        },
      }),
    };

    return request;
  };

  return {
    apiClient,
    session,
    baseHandlerConfiguration,
    extractorConfiguration,
    userHandlerConfiguration,
    parHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
    authorizationPageHandlerConfiguration,
    authorizationHandlerConfiguration,
    authorizationDecisionHandlerConfiguration,
    tokenCreateHandlerConfiguration,
    tokenFailHandlerConfiguration,
    tokenIssueHandlerConfiguration,
    tokenHandlerConfiguration,
    introspectionHandlerConfiguration,
    serviceConfigurationHandlerConfiguration,
    credentialMetadataHandlerConfiguration,
    credentialSingleParseHandlerConfiguration,
    createParParameters,
    createParRequest,
    createParPostRequest,
    processParPostRequest,
    createAuthorizationParameters,
    createAuthorizationRequest,
    createAuthorizationGetRequest,
    processAuthorizationGetRequest,
    createAuthorizationFailRequest,
    createAuthorizationIssueRequest,
    createAuthorizationDecisionParameters,
    createAuthorizationDecisionGetRequest,
    createAuthorizationDecisionPostRequest,
    processAuthorizationDecisionPostRequest,
    createTokenRequest,
    createTokenPostRequest,
    processTokenPostRequest,
    createIntrospectionRequest,
    createServiceConfigurationRequest,
    createCredentialIssuerMetadataRequest,
    createCredentialSingleParseRequest,
  };
};
