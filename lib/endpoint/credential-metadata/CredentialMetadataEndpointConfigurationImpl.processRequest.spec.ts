import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../../handler/BaseHandlerConfigurationImpl';
import { CredentialMetadataEndpointConfigurationImpl } from './CredentialMetadataEndpointConfigurationImpl';

describe('CredentialMetadataEndpointConfiguration.processRequest', () => {
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
  const endpointConfiguration = new CredentialMetadataEndpointConfigurationImpl(
    baseHandlerConfiguration
  );

  const testCredentialMetadata = async () => {
    const request = new Request('http://localhost?pretty=true');

    const response = await endpointConfiguration.processRequest(request);
    const responseBody = await response.json();
    //console.log(responseBody);

    expect(response.status).toBe(200);
    expect(responseBody.credential_issuer).toBeDefined();
  };

  it('should successfully process request', async () => {
    await testCredentialMetadata();
  }, 10000);
});
