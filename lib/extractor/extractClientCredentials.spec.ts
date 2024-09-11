import { describe, it, expect } from 'vitest';
import { defaultExtractClientCredentials } from './extractClientCredentials';

describe('defaultExtractClientCredentials', () => {
  it('should extract client credentials from Authorization header', async () => {
    const clientId = 'testClientId';
    const clientSecret = 'testClientSecret';
    const encodedCredentials = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString('base64');
    const request = new Request('https://example.com', {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });

    const result = await defaultExtractClientCredentials(request);

    expect(result).toEqual({ clientId, clientSecret });
  });

  it('should return undefined credentials when Authorization header is missing', async () => {
    const request = new Request('https://example.com');

    const result = await defaultExtractClientCredentials(request);

    expect(result).toEqual({ clientId: undefined, clientSecret: undefined });
  });

  it('should return undefined credentials when Authorization header is invalid', async () => {
    const request = new Request('https://example.com', {
      headers: {
        Authorization: 'Invalid Auth',
      },
    });

    const result = await defaultExtractClientCredentials(request);

    expect(result).toEqual({ clientId: undefined, clientSecret: undefined });
  });

  it('should handle non-Basic auth schemes', async () => {
    const request = new Request('https://example.com', {
      headers: {
        Authorization: 'Bearer sometoken',
      },
    });

    const result = await defaultExtractClientCredentials(request);

    expect(result).toEqual({ clientId: undefined, clientSecret: undefined });
  });
});
