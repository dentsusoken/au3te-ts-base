import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../BaseHandlerConfigurationImpl';
import { ServiceConfigurationHandlerConfigurationImpl } from './ServiceConfigurationHandlerConfigurationImpl';
import { ServiceConfigurationRequest } from 'au3te-ts-common/schemas.service-configuration';

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
const config = new ServiceConfigurationHandlerConfigurationImpl(
  baseHandlerConfiguration
);

const testServiceConfiguration = async () => {
  const request: ServiceConfigurationRequest = {
    pretty: true,
    patch:
      '[{"op":"replace","path":"/subject_types_supported","value":["public"]}]',
  };

  const response = await config.handle(request);
  const responseBody = await response.json();
  console.log(responseBody);

  expect(response.status).toBe(200);
  expect(responseBody.issuer).toBeDefined();
};

describe('ServiceConfigurationHandlerConfiguration.handle', () => {
  it('should successfully handle()', async () => {
    await testServiceConfiguration();
  }, 10000);
});
