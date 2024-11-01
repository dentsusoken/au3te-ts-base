import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../../handler/BaseHandlerConfigurationImpl';
import { AuthorizationEndpointConfigurationImpl } from './AuthorizationEndpointConfigurationImpl';
import { ExtractorConfigurationImpl } from '../../extractor/ExtractorConfigurationImpl';

describe('AuthorizationEndpointConfiguration.processRequest', () => {
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
  const endpointConfiguration = new AuthorizationEndpointConfigurationImpl(
    baseHandlerConfiguration,
    extractorConfiguration
  );

  const testAuthorizationGetRequest = async () => {
    // Create URL with query parameters matching PAR request parameters
    const url = new URL('http://localhost/authorize');
    const params = new URLSearchParams({
      scope: 'org.iso.18013.5.1.mDL openid',
      redirect_uri: 'eudi-openid4ci://authorize/',
      response_type: 'code',
      client_id: 'tw24.wallet.dentsusoken.com',
    });

    const request = new Request(`${url}?${params.toString()}`, {
      method: 'GET',
    });

    const response = await endpointConfiguration.processRequest(request);

    // Should return 200 OK for the authorization page
    expect(response.status).toBe(200);
  };

  const testAuthorizationPostRequest = async () => {
    const params = new URLSearchParams({
      scope: 'org.iso.18013.5.1.mDL openid',
      redirect_uri: 'eudi-openid4ci://authorize/',
      response_type: 'code',
      client_id: 'tw24.wallet.dentsusoken.com',
    });

    const request = new Request('http://localhost/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const response = await endpointConfiguration.processRequest(request);

    // Should return 200 OK for the authorization page
    expect(response.status).toBe(200);
  };

  it('should successfully process GET authorization request', async () => {
    await testAuthorizationGetRequest();
  }, 10000);

  it('should successfully process POST authorization request', async () => {
    await testAuthorizationPostRequest();
  }, 10000);
});
