import { describe, it, expect } from 'vitest';
import { CredentialMetadataHandlerConfigurationImpl } from './CredentialMetadataHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ApiClient } from 'au3te-ts-common/api';
import { SessionSchemas } from '../../session/types';

describe('CredentialMetadataHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    credentialIssuerMetadataPath: '/credential-issuer-metadata',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as BaseHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new CredentialMetadataHandlerConfigurationImpl(
      mockBaseConfig
    );

    expect(config.path).toBe('/.well-known/openid-credential-issuer');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
  });
});
