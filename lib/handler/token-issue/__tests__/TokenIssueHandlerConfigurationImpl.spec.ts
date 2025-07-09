import { describe, it, expect } from 'vitest';
import { TokenIssueHandlerConfigurationImpl } from '../TokenIssueHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../../BaseHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { SessionSchemas } from '../../../session/types';

describe('TokenIssueHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    tokenIssuePath: '/token/issue',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as BaseHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new TokenIssueHandlerConfigurationImpl(mockBaseConfig);

    expect(config.path).toBe('/api/token/issue');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
  });
});
