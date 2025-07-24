import { describe, it, expect } from 'vitest';
import { CredentialSingleParseHandlerConfigurationImpl } from '../CredentialSingleParseHandlerConfigurationImpl';
import { ServerHandlerConfiguration } from '../../core/ServerHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { SessionSchemas } from '../../../session/types';

describe('CredentialSingleParseHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    credentialSingleParsePath: '/api/credential/single/parse',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockServerConfig = {
    apiClient: mockApiClient,
  } as ServerHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new CredentialSingleParseHandlerConfigurationImpl(
      mockServerConfig
    );

    expect(config.path).toBe('/api/credential/single/parse');
    expect(config.processApiRequest).toBeDefined();
    expect(config.validateApiResponse).toBeDefined();
    expect(config.processApiRequestWithValidation).toBeDefined();
  });
});
