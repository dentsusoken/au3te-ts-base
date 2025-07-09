import { describe, expect, it, vi } from 'vitest';
import { BaseCredentialHandlerConfigurationImpl } from '../BaseCredentialHandlerConfigurationImpl';
import { CredentialMetadataHandlerConfiguration } from '../../credential-metadata/CredentialMetadataHandlerConfiguration';

describe('BaseCredentialHandlerConfigurationImpl', () => {
  it('should properly initialize with credential metadata handler configuration', () => {
    // Arrange
    const mockProcessApiRequestWithValidation = vi.fn();
    const mockCredentialMetadataHandlerConfiguration = {
      processApiRequestWithValidation: mockProcessApiRequestWithValidation,
    } as unknown as CredentialMetadataHandlerConfiguration;

    // Act
    const config = new BaseCredentialHandlerConfigurationImpl({
      credentialMetadataHandlerConfiguration:
        mockCredentialMetadataHandlerConfiguration,
    });

    // Assert
    expect(config).toBeInstanceOf(BaseCredentialHandlerConfigurationImpl);
    expect(config.computeHtu).toBeTypeOf('function');
  });
});
