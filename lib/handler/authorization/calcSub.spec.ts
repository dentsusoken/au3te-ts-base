import { describe, it, expect, vi } from 'vitest';
import { defaultCalcSub } from './calcSub';
import { Client } from 'au3te-ts-common/schemas.common';

// Mock the crypto.subtle.digest function
const mockDigest = vi.fn();
vi.stubGlobal('crypto', {
  subtle: {
    digest: mockDigest,
  },
});

describe('defaultCalcSub', () => {
  // Test case for undefined subject
  it('should return undefined for undefined subject', async () => {
    const result = await defaultCalcSub(undefined, {} as Client);
    expect(result).toBeUndefined();
  });

  // Test case for undefined client
  it('should return undefined for undefined client', async () => {
    const result = await defaultCalcSub('subject', undefined);
    expect(result).toBeUndefined();
  });

  // Test case for non-pairwise subject type
  it('should return undefined for non-pairwise subject type', async () => {
    const client: Client = { subjectType: 'public' } as Client;
    const result = await defaultCalcSub('subject', client);
    expect(result).toBeUndefined();
  });

  // Test case for missing derivedSectorIdentifier
  it('should return undefined for missing derivedSectorIdentifier', async () => {
    const client: Client = { subjectType: 'pairwise' } as Client;
    const result = await defaultCalcSub('subject', client);
    expect(result).toBeUndefined();
  });

  // Test case for successful sub generation
  it('should generate sub correctly', async () => {
    const client: Client = {
      subjectType: 'pairwise',
      derivedSectorIdentifier: 'sector123',
    } as Client;

    // Mock the digest result
    const mockHashBuffer = new Uint8Array([1, 2, 3, 4]);
    mockDigest.mockResolvedValue(mockHashBuffer.buffer);

    const result = await defaultCalcSub('subject123', client);

    // Check if the digest function was called with correct parameters
    expect(mockDigest).toHaveBeenCalledWith('SHA-256', expect.any(Uint8Array));

    // Check if the result is a string of hexadecimal values
    expect(result).toBe('01020304');
  });
});
