import { describe, it, expect, vi } from 'vitest';
import { BaseEndpoint } from './BaseEndpoint';
import { defaultExtractParameters } from '../extractor/extractParameters';
import { defaultExtractClientCredentials } from '../extractor/extractClientCredentials';
import { defaultExtractClientCertificateAndPath } from '../extractor/extractClientCertificateAndPath';

describe('BaseEndpoint', () => {
  it('should initialize with default values when no options are provided', () => {
    const endpoint = new BaseEndpoint();

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

    const endpoint = new BaseEndpoint({
      extractParameters: mockExtractParameters,
      extractClientCredentials: mockExtractClientCredentials,
      extractClientCertificateAndPath: mockExtractClientCertificateAndPath,
    });

    expect(endpoint.extractParameters).toBe(mockExtractParameters);
    expect(endpoint.extractClientCredentials).toBe(
      mockExtractClientCredentials
    );
    expect(endpoint.extractClientCertificateAndPath).toBe(
      mockExtractClientCertificateAndPath
    );
  });
});
