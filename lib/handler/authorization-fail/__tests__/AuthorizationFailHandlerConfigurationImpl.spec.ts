import { describe, it, expect } from 'vitest';
import { AuthorizationFailHandlerConfigurationImpl } from '../AuthorizationFailHandlerConfigurationImpl';
import { ServerHandlerConfiguration } from '../../ServerHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { SessionSchemas } from '../../../session/types';

describe('AuthorizationFailHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    authorizationFailPath: '/authorization-fail',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockServerConfig = {
    apiClient: mockApiClient,
  } as ServerHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new AuthorizationFailHandlerConfigurationImpl(
      mockServerConfig
    );

    expect(config.path).toBe('/api/authorization/fail');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.buildAuthorizationFailError).toBeDefined();
  });
});
