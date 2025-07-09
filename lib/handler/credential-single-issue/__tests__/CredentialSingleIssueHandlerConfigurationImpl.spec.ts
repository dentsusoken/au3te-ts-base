import { describe, it, expect, vi } from 'vitest';
import { CredentialSingleIssueHandlerConfigurationImpl } from '../CredentialSingleIssueHandlerConfigurationImpl';
import { ExtractorConfiguration } from '../../../extractor/ExtractorConfiguration';
import { BaseCredentialHandlerConfiguration } from '../../credential/BaseCredentialHandlerConfiguration';
import { IntrospectionHandlerConfiguration } from '../../introspection/IntrospectionHandlerConfiguration';
import { BaseHandlerConfiguration } from '../../BaseHandlerConfiguration';
import { CredentialSingleParseHandlerConfiguration } from '../../credential-single-parse/CredentialSingleParseHandlerConfiguration';
import { CommonCredentialHandlerConfiguration } from '@vecrea/au3te-ts-common/handler.credential';
import { sessionSchemas } from '../../../session/sessionSchemas';

describe('CredentialSingleIssueHandlerConfigurationImpl', () => {
  // Mock functions
  const mockExtractAccessToken = vi.fn();
  const mockExtractClientCertificateAndPath = vi.fn();
  const mockExtractParameters = vi.fn();
  const mockExtractClientCredentials = vi.fn();
  const mockComputeHtu = vi.fn();
  const mockProcessApiRequestWithValidation = vi.fn();
  const mockGetToOrder = vi.fn();

  // Mock configurations
  const mockExtractorConfiguration = {
    extractAccessToken: mockExtractAccessToken,
    extractClientCertificateAndPath: mockExtractClientCertificateAndPath,
    extractParameters: mockExtractParameters,
    extractClientCredentials: mockExtractClientCredentials,
  } as unknown as ExtractorConfiguration;

  const mockBaseCredentialHandlerConfiguration = {
    computeHtu: mockComputeHtu,
  } as unknown as BaseCredentialHandlerConfiguration;

  const mockIntrospectionHandlerConfiguration = {
    processApiRequestWithValidation: mockProcessApiRequestWithValidation,
  } as unknown as IntrospectionHandlerConfiguration;

  const mockApiClient = {
    credentialSingleIssuePath: '/some/path',
  };

  const baseHandlerConfiguration = {
    apiClient: mockApiClient,
    buildUnknownActionMessage: vi.fn(),
  } as unknown as BaseHandlerConfiguration<typeof sessionSchemas>;

  const mockCredentialSingleParseHandlerConfiguration = {
    processApiRequestWithValidation: mockProcessApiRequestWithValidation,
  } as unknown as CredentialSingleParseHandlerConfiguration;

  const mockCommonCredentialHandlerConfiguration = {
    getToOrder: mockGetToOrder,
  } as unknown as CommonCredentialHandlerConfiguration;

  it('should create an instance with toApiRequest configured', () => {
    // Arrange
    const params = {
      extractorConfiguration: mockExtractorConfiguration,
      baseCredentialHandlerConfiguration:
        mockBaseCredentialHandlerConfiguration,
      introspectionHandlerConfiguration: mockIntrospectionHandlerConfiguration,
      baseHandlerConfiguration: baseHandlerConfiguration,
      credentialSingleParseHandlerConfiguration:
        mockCredentialSingleParseHandlerConfiguration,
      commonCredentialHandlerConfiguration:
        mockCommonCredentialHandlerConfiguration,
    };

    // Act
    const configuration = new CredentialSingleIssueHandlerConfigurationImpl(
      params
    );

    // Assert
    expect(configuration).toBeInstanceOf(
      CredentialSingleIssueHandlerConfigurationImpl
    );
    expect(configuration.toApiRequest).toBeDefined();
    expect(typeof configuration.toApiRequest).toBe('function');
    expect(configuration.processApiRequest).toBeDefined();
    expect(typeof configuration.processApiRequest).toBe('function');
    expect(configuration.processApiResponse).toBeDefined();
    expect(typeof configuration.processApiResponse).toBe('function');
    expect(configuration.processRequest).toBeDefined();
    expect(typeof configuration.processRequest).toBe('function');
  });
});
