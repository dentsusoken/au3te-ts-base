import { describe, it, expect, vi } from 'vitest';
import { ParHandlerConfigurationImpl } from './ParHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ApiClient } from 'au3te-ts-common/api';
import { SessionSchemas } from '../../session/types';

describe('ParHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    pushAuthorizationRequestPath: '/par',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as BaseHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new ParHandlerConfigurationImpl(mockBaseConfig);

    expect(config.path).toBe('/api/par');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
  });
});
