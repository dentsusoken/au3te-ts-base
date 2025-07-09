import { describe, it, expect } from 'vitest';
import { CredentialMetadataHandlerConfigurationImpl } from '../CredentialMetadataHandlerConfigurationImpl';
import { ServerHandlerConfiguration } from '../../ServerHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { SessionSchemas } from '../../../session/types';

describe('CredentialMetadataHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    credentialIssuerMetadataPath: '/credential-issuer-metadata',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockServerConfig = {
    apiClient: mockApiClient,
  } as ServerHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new CredentialMetadataHandlerConfigurationImpl(
      mockServerConfig
    );

    expect(config.path).toBe('/.well-known/openid-credential-issuer');
    expect(config.processApiRequest).toBeDefined();
    expect(config.validateApiResponse).toBeDefined();
    expect(config.processApiRequestWithValidation).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
  });
});
