import { describe, it, expect } from 'vitest';
import { ServiceJwksHandlerConfigurationImpl } from './ServiceJwksHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ApiClient } from 'au3te-ts-common/api';
import { SessionSchemas } from '../../session/types';

describe('ServiceJwksHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    serviceJwksPath: '/api/jwks',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as BaseHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new ServiceJwksHandlerConfigurationImpl(mockBaseConfig);

    expect(config.path).toBe('/api/jwks');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
  });
});
