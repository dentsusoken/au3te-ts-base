import { describe, it, expect } from 'vitest';
import { IntrospectionHandlerConfigurationImpl } from './IntrospectionHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { SessionSchemas } from '../../session/types';

describe('IntrospectionHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    introspectionPath: '/api/auth/introspection',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as BaseHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new IntrospectionHandlerConfigurationImpl(mockBaseConfig);

    expect(config.path).toBe('/api/introspection');
    expect(config.processApiRequest).toBeDefined();
    expect(config.validateApiResponse).toBeDefined();
    expect(config.processApiRequestWithValidation).toBeDefined();
  });
});
