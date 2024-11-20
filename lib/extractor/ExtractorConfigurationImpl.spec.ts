import { describe, it, expect } from 'vitest';
import { ExtractorConfigurationImpl } from './ExtractorConfigurationImpl';
import { defaultExtractParameters } from './extractParameters';
import { defaultExtractClientCredentials } from './extractClientCredentials';
import { defaultExtractClientCertificateAndPath } from './extractClientCertificateAndPath';
import { defaultExtractAccessToken } from './extractAccessToken';

describe('ExtractorConfigurationImpl', () => {
  it('should initialize with default extractors', () => {
    const config = new ExtractorConfigurationImpl();

    expect(config.extractParameters).toBe(defaultExtractParameters);
    expect(config.extractClientCredentials).toBe(
      defaultExtractClientCredentials
    );
    expect(config.extractClientCertificateAndPath).toBe(
      defaultExtractClientCertificateAndPath
    );
    expect(config.extractAccessToken).toBe(defaultExtractAccessToken);
  });
});
