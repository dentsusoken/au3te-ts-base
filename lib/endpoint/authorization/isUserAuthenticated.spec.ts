import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createIsUserAuthenticated,
  IsUserAuthenticated,
} from './isUserAuthenticated';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';

describe('createIsUserAuthenticated', () => {
  let session: InMemorySession<typeof sessionSchemas>;
  let isUserAuthenticated: IsUserAuthenticated;

  beforeEach(() => {
    session = new InMemorySession(sessionSchemas);
    isUserAuthenticated = createIsUserAuthenticated(session);
  });

  it('should return true when user exists in session', async () => {
    await session.set('user', { subject: 'user123' });
    const result = await isUserAuthenticated();
    expect(result).toBe(true);
  });

  it('should return false when user does not exist in session', async () => {
    const result = await isUserAuthenticated();
    expect(result).toBe(false);
  });

  it('should return false when session throws an error', async () => {
    vi.spyOn(session, 'get').mockRejectedValueOnce(new Error('Session error'));
    const result = await isUserAuthenticated();
    expect(result).toBe(false);
  });
});
