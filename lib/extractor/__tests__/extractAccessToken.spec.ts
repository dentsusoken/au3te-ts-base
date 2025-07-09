import { describe, it, expect } from 'vitest';
import { defaultExtractAccessToken } from '../extractAccessToken';

describe('defaultExtractAccessToken', () => {
  it('should extract DPoP token from Authorization header', () => {
    const request = new Request('https://example.com', {
      headers: {
        Authorization: 'DPoP eyJ0eXAiOiJkcG9wK2p3dCI...',
      },
    });

    const token = defaultExtractAccessToken(request);
    expect(token).toBe('eyJ0eXAiOiJkcG9wK2p3dCI...');
  });

  it('should extract Bearer token from Authorization header', () => {
    const request = new Request('https://example.com', {
      headers: {
        Authorization: 'Bearer abc123token',
      },
    });

    const token = defaultExtractAccessToken(request);
    expect(token).toBe('abc123token');
  });

  it('should return undefined when Authorization header is missing', () => {
    const request = new Request('https://example.com');

    const token = defaultExtractAccessToken(request);
    expect(token).toBeUndefined();
  });

  it('should return undefined for invalid Authorization header format', () => {
    const request = new Request('https://example.com', {
      headers: {
        Authorization: 'Invalid token123',
      },
    });

    const token = defaultExtractAccessToken(request);
    expect(token).toBeUndefined();
  });
});
