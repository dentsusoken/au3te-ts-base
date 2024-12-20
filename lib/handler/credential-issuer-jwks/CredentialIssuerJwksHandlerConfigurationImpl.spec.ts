import { describe, it, expect } from 'vitest';
import { CredentialIssuerJwksHandlerConfigurationImpl } from './CredentialIssuerJwksHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ApiClient } from 'au3te-ts-common/api';
import { SessionSchemas } from '../../session/types';

describe('CredentialIssuerJwksHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    credentialIssuerJwksPath: '/api/vci/jwks',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as BaseHandlerConfiguration<SessionSchemas>;

  it('should initialize with required properties', () => {
    const config = new CredentialIssuerJwksHandlerConfigurationImpl(
      mockBaseConfig
    );

    expect(config.path).toBe('/api/vci/jwks');
    expect(config.processApiRequest).toBeDefined();
    expect(config.validateApiResponse).toBeDefined();
    expect(config.processApiRequestWithValidation).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
  });
});
