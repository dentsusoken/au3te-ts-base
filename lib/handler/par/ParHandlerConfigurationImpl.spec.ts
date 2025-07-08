import { describe, it, expect } from 'vitest';
import { ParHandlerConfigurationImpl } from './ParHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { Session } from '../../session/Session';
import { sessionSchemas } from '../../session/sessionSchemas';
import { ExtractorConfigurationImpl } from '../../extractor/ExtractorConfigurationImpl';

describe('ParHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    pushAuthorizationRequestPath: '/par',
  } as ApiClient;

  // Mock Session
  const mockSession = {} as Session<typeof sessionSchemas>;

  // Create a mock BaseHandlerConfiguration
  const mockBaseConfig = {
    apiClient: mockApiClient,
    session: mockSession,
  } as BaseHandlerConfiguration<typeof sessionSchemas>;

  // Create ExtractorConfiguration instance
  const extractorConfiguration = new ExtractorConfigurationImpl();

  it('should initialize with all required properties', () => {
    const config = new ParHandlerConfigurationImpl({
      baseHandlerConfiguration: mockBaseConfig,
      extractorConfiguration,
    });

    expect(config.path).toBe('/api/par');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
  });
});
