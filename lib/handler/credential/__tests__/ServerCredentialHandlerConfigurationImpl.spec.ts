import { describe, expect, it, vi } from 'vitest';
import { ServerCredentialHandlerConfigurationImpl } from '../ServerCredentialHandlerConfigurationImpl';
import { CredentialMetadataHandlerConfiguration } from '../../credential-metadata/CredentialMetadataHandlerConfiguration';

describe('ServerCredentialHandlerConfigurationImpl', () => {
  it('should properly initialize with credential metadata handler configuration', () => {
    // Arrange
    const mockProcessApiRequestWithValidation = vi.fn();
    const mockCredentialMetadataHandlerConfiguration = {
      processApiRequestWithValidation: mockProcessApiRequestWithValidation,
    } as unknown as CredentialMetadataHandlerConfiguration;

    // Act
    const config = new ServerCredentialHandlerConfigurationImpl({
      credentialMetadataHandlerConfiguration:
        mockCredentialMetadataHandlerConfiguration,
    });

    // Assert
    expect(config).toBeInstanceOf(ServerCredentialHandlerConfigurationImpl);
    expect(config.computeHtu).toBeTypeOf('function');
  });
});
