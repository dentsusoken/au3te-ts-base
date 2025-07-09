import { describe, it, expect } from 'vitest';
import { TokenFailHandlerConfigurationImpl } from '../TokenFailHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../../BaseHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { SessionSchemas } from '../../../session/types';

describe('TokenFailHandlerConfigurationImpl', () => {
  const mockApiClient = {
    tokenFailPath: '/token/fail',
  } as ApiClient;

  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as BaseHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new TokenFailHandlerConfigurationImpl(mockBaseConfig);

    expect(config.path).toBe('/api/token/fail');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.buildTokenFailError).toBeDefined();
  });
});
