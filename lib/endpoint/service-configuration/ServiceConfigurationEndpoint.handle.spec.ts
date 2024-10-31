import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../../handler/BaseHandlerConfigurationImpl';
import { ServiceConfigurationEndpointConfigurationImpl } from './ServiceConfigurationEndpointConfigurationImpl';

describe('ServiceConfigurationEndpointConfiguration.processRequest', () => {
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
  const endpointConfiguration =
    new ServiceConfigurationEndpointConfigurationImpl(baseHandlerConfiguration);

  const testServiceConfiguration = async () => {
    const request = new Request(
      'http://localhost?pretty=true&patch=%5B%7B%22op%22%3A%22replace%22%2C%22path%22%3A%22%2Fsubject_types_supported%22%2C%22value%22%3A%5B%22public%22%5D%7D%5D'
    );

    const response = await endpointConfiguration.processRequest(request);
    const responseBody = await response.json();
    //console.log(responseBody);

    expect(response.status).toBe(200);
    expect(responseBody.issuer).toBeDefined();
  };

  it('should successfully process request', async () => {
    await testServiceConfiguration();
  }, 10000);
});
