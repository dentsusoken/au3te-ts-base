import { describe, it, expect } from 'vitest';
import { ServiceConfigurationHandlerConfigurationImpl } from '../ServiceConfigurationHandlerConfigurationImpl';
import { ServerHandlerConfiguration } from '../../ServerHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { SessionSchemas } from '../../../session/types';

describe('ServiceConfigurationHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    serviceConfigurationPath: '/service-configuration',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockServerConfig = {
    apiClient: mockApiClient,
  } as ServerHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new ServiceConfigurationHandlerConfigurationImpl(
      mockServerConfig
    );

    expect(config.path).toBe('/.well-known/openid-configuration');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
  });
});
