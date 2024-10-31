import { describe, expect, it } from 'vitest';
import { ParEndpointConfigurationImpl } from './ParEndpointConfigurationImpl';
import { BaseHandlerConfiguration } from '../../handler/BaseHandlerConfiguration';
import { ApiClient } from 'au3te-ts-common/api';
import { Session } from '../../session/Session';
import { sessionSchemas } from '../../session/sessionSchemas';
import { ExtractorConfigurationImpl } from '../../extractor/ExtractorConfigurationImpl';

// Mock ApiClient and Session
const mockApiClient = {} as ApiClient;
const mockSession = {} as Session<typeof sessionSchemas>;

describe('ParEndpointConfigurationImpl', () => {
  // Create a mock BaseHandlerConfiguration
  const baseHandlerConfiguration = {
    apiClient: mockApiClient,
    session: mockSession,
  } as BaseHandlerConfiguration<typeof sessionSchemas>;

  // Create ExtractorConfiguration instance
  const extractorConfiguration = new ExtractorConfigurationImpl();

  it('should initialize with required properties', () => {
    const config = new ParEndpointConfigurationImpl(
      baseHandlerConfiguration,
      extractorConfiguration
    );

    // Check if required properties are defined
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
  });
});
