import { describe, it, expect, vi } from 'vitest';
import { BaseEndpoint } from './BaseEndpoint';
import { defaultExtractParameters } from '../extractor/extractParameters';
import { defaultExtractClientCredentials } from '../extractor/extractClientCredentials';
import { defaultExtractClientCertificateAndPath } from '../extractor/extractClientCertificateAndPath';

describe('BaseEndpoint', () => {
  const testPath = '/test/path';

  it('should initialize with default values when no options are provided', () => {
    const endpoint = new BaseEndpoint(testPath);

    expect(endpoint.path).toBe(testPath);
    expect(endpoint.extractParameters).toBe(defaultExtractParameters);
    expect(endpoint.extractClientCredentials).toBe(
      defaultExtractClientCredentials
    );
    expect(endpoint.extractClientCertificateAndPath).toBe(
      defaultExtractClientCertificateAndPath
    );
  });

  it('should use provided options when initializing', () => {
    const mockExtractParameters = vi.fn();
    const mockExtractClientCredentials = vi.fn();
    const mockExtractClientCertificateAndPath = vi.fn();

    const endpoint = new BaseEndpoint(testPath, {
      extractParameters: mockExtractParameters,
      extractClientCredentials: mockExtractClientCredentials,
      extractClientCertificateAndPath: mockExtractClientCertificateAndPath,
    });

    expect(endpoint.path).toBe(testPath);
    expect(endpoint.extractParameters).toBe(mockExtractParameters);
    expect(endpoint.extractClientCredentials).toBe(
      mockExtractClientCredentials
    );
    expect(endpoint.extractClientCertificateAndPath).toBe(
      mockExtractClientCertificateAndPath
    );
  });

  it('should inherit properties from CommonEndpoint', () => {
    const mockBuildErrorMessage = vi.fn();
    const mockBuildEndpointErrorMessage = vi.fn();
    const mockOutputErrorMessage = vi.fn();
    const mockProcessError = vi.fn();
    const mockBuildUnknownActionMessage = vi.fn();

    const endpoint = new BaseEndpoint(testPath, {
      buildErrorMessage: mockBuildErrorMessage,
      buildEndpointErrorMessage: mockBuildEndpointErrorMessage,
      outputErrorMessage: mockOutputErrorMessage,
      processError: mockProcessError,
      buildUnknownActionMessage: mockBuildUnknownActionMessage,
    });

    expect(endpoint.buildErrorMessage).toBe(mockBuildErrorMessage);
    expect(endpoint.buildEndpointErrorMessage).toBe(
      mockBuildEndpointErrorMessage
    );
    expect(endpoint.outputErrorMessage).toBe(mockOutputErrorMessage);
    expect(endpoint.processError).toBe(mockProcessError);
    expect(endpoint.buildUnknownActionMessage).toBe(
      mockBuildUnknownActionMessage
    );
  });

  it('should allow mixing of BaseEndpoint and CommonEndpoint options', () => {
    const mockExtractParameters = vi.fn();
    const mockBuildErrorMessage = vi.fn();

    const endpoint = new BaseEndpoint(testPath, {
      extractParameters: mockExtractParameters,
      buildErrorMessage: mockBuildErrorMessage,
    });

    expect(endpoint.extractParameters).toBe(mockExtractParameters);
    expect(endpoint.buildErrorMessage).toBe(mockBuildErrorMessage);
    expect(endpoint.extractClientCredentials).toBe(
      defaultExtractClientCredentials
    );
  });
});
