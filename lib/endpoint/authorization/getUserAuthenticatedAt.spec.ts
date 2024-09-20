import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createGetUserAuthenticatedAt,
  GetUserAuthenticatedAt,
} from './getUserAuthenticatedAt';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';

describe('createGetUserAuthenticatedAt', () => {
  let session: InMemorySession<typeof sessionSchemas>;
  let getUserAuthenticatedAt: GetUserAuthenticatedAt;

  beforeEach(() => {
    session = new InMemorySession(sessionSchemas);
    getUserAuthenticatedAt = createGetUserAuthenticatedAt(session);
  });

  it('should return authTime when it exists in session', async () => {
    const mockAuthTime = Math.floor(Date.now() / 1000);
    await session.set('authTime', mockAuthTime);
    const result = await getUserAuthenticatedAt();
    expect(result).toBe(mockAuthTime);
  });

  it('should return 0 when authTime does not exist in session', async () => {
    const result = await getUserAuthenticatedAt();
    expect(result).toBe(0);
  });

  it('should return 0 when session throws an error', async () => {
    vi.spyOn(session, 'get').mockRejectedValueOnce(new Error('Session error'));
    const result = await getUserAuthenticatedAt();
    expect(result).toBe(0);
  });
});
