import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../../handler/BaseHandlerConfigurationImpl';
import { ParEndpointConfigurationImpl } from './ParEndpointConfigurationImpl';
import { ExtractorConfigurationImpl } from '../../extractor/ExtractorConfigurationImpl';

describe('ParEndpointConfiguration.processRequest', () => {
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
  const endpointConfiguration = new ParEndpointConfigurationImpl(
    baseHandlerConfiguration,
    extractorConfiguration
  );

  const testPushAuthorizationRequest = async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        scope: 'openid',
        redirect_uri: process.env.REDIRECT_URI || '',
        response_type: 'code',
        client_id: process.env.CLIENT_ID || '',
      }).toString(),
    });

    const response = await endpointConfiguration.processRequest(request);
    const responseBody = await response.json();
    //console.log(responseBody);

    expect(response.status).toBe(201);
    expect(responseBody.expires_in).toBeDefined();
    expect(responseBody.request_uri).toBeDefined();
  };

  it('should successfully process request', async () => {
    await testPushAuthorizationRequest();
  }, 10000);
});
