import { describe, expect, it } from 'vitest';
import { ServiceConfigurationEndpointConfigurationImpl } from './ServiceConfigurationEndpointConfigurationImpl';
import { BaseHandlerConfiguration } from '../../handler/BaseHandlerConfiguration';
import { ApiClient } from 'au3te-ts-common/api';
import { Session } from '../../session/Session';
import { sessionSchemas } from '../../session/sessionSchemas';

// Mock ApiClient and Session
const mockApiClient = {} as ApiClient;
const mockSession = {} as Session<typeof sessionSchemas>;

describe('ServiceConfigurationEndpointConfigurationImpl', () => {
  // Create a mock BaseHandlerConfiguration
  const baseHandlerConfiguration = {
    apiClient: mockApiClient,
    session: mockSession,
  } as BaseHandlerConfiguration<typeof sessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new ServiceConfigurationEndpointConfigurationImpl(
      baseHandlerConfiguration
    );

    // Check if required properties are defined
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
  });
});
