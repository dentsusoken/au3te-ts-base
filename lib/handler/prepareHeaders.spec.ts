import { describe, it, expect } from 'vitest';
import { defaultPrepareHeaders } from './prepareHeaders';

describe('defaultPrepareHeaders', () => {
  it('returns empty headers object when dpopNonce is undefined', () => {
    const headers = defaultPrepareHeaders({ dpopNonce: undefined });
    expect(headers).toEqual({});
  });

  it('returns headers object with DPoP-Nonce when dpopNonce is provided', () => {
    const dpopNonce = 'test-nonce-value';
    const headers = defaultPrepareHeaders({ dpopNonce });
    expect(headers).toEqual({
      'DPoP-Nonce': dpopNonce,
    });
  });

  it('includes DPoP-Nonce header even when dpopNonce is an empty string', () => {
    const dpopNonce = '';
    const headers = defaultPrepareHeaders({ dpopNonce });
    expect(headers).toEqual({});
  });
});
