import { describe, it, expect } from 'vitest';
import { AuthorizationFailHandlerConfigurationImpl } from './AuthorizationFailHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { SessionSchemas } from '../../session/types';

describe('AuthorizationFailHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    authorizationFailPath: '/authorization-fail',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as BaseHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new AuthorizationFailHandlerConfigurationImpl(
      mockBaseConfig
    );

    expect(config.path).toBe('/api/authorization/fail');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.buildAuthorizationFailError).toBeDefined();
  });
});
