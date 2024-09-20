import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGetUserSubject, GetUserSubject } from './getUserSubject';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { User } from 'au3te-ts-common/schemas.common';

describe('createGetUserSubject', () => {
  let session: InMemorySession<typeof sessionSchemas>;
  let getUserSubject: GetUserSubject;

  beforeEach(() => {
    session = new InMemorySession(sessionSchemas);
    getUserSubject = createGetUserSubject(session);
  });

  it('should return user subject when it exists in session', async () => {
    const mockUser = { subject: 'user123' };
    await session.set('user', mockUser);
    const result = await getUserSubject();
    expect(result).toBe('user123');
  });

  it('should return undefined when user does not exist in session', async () => {
    const result = await getUserSubject();
    expect(result).toBeUndefined();
  });

  it('should return undefined when user exists but has no subject', async () => {
    await session.set('user', {} as User);
    const result = await getUserSubject();
    expect(result).toBeUndefined();
  });

  it('should return undefined when session throws an error', async () => {
    vi.spyOn(session, 'get').mockRejectedValueOnce(new Error('Session error'));
    const result = await getUserSubject();
    expect(result).toBeUndefined();
  });
});
