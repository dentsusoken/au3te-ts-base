import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGetSub, GetSub } from './getSub';
import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';
import { GetUserSubject } from './getUserSubject';

const mockDigest = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]));
vi.stubGlobal('crypto', { subtle: { digest: mockDigest } });

describe('createGetSub', () => {
  let getSub: GetSub;
  let mockGetUserSubject: GetUserSubject;

  beforeEach(() => {
    mockGetUserSubject = vi.fn();
    getSub = createGetSub(mockGetUserSubject);
  });

  it('should return undefined when userSubject is undefined', async () => {
    vi.mocked(mockGetUserSubject).mockResolvedValue(undefined);
    const response = {} as AuthorizationResponse;
    const result = await getSub(response);
    expect(result).toBeUndefined();
  });

  it('should return userSubject for non-pairwise client', async () => {
    const userSubject = 'user123';
    vi.mocked(mockGetUserSubject).mockResolvedValue(userSubject);
    const response = {
      client: { subjectType: 'public' },
    } as AuthorizationResponse;
    const result = await getSub(response);
    expect(result).toBe(userSubject);
  });

  it('should return undefined for pairwise client without sectorIdentifier', async () => {
    vi.mocked(mockGetUserSubject).mockResolvedValue('user123');
    const response = {
      client: { subjectType: 'pairwise', derivedSectorIdentifier: undefined },
    } as AuthorizationResponse;
    const result = await getSub(response);
    expect(result).toBeUndefined();
  });

  it('should return hashed value for pairwise client', async () => {
    const userSubject = 'user123';
    vi.mocked(mockGetUserSubject).mockResolvedValue(userSubject);
    const response = {
      client: { subjectType: 'pairwise', derivedSectorIdentifier: 'sector123' },
    } as AuthorizationResponse;
    const result = await getSub(response);
    expect(result).toBe('01020304');
  });
});
