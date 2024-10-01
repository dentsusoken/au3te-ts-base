import { describe, it, expect, beforeEach } from 'vitest';
import { createGetAuthTime, GetAuthTime } from './getAuthTime';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';

describe('createGetAuthTime', () => {
  let session: InMemorySession<typeof sessionSchemas>;
  let getAuthTime: GetAuthTime;

  beforeEach(() => {
    session = new InMemorySession(sessionSchemas);
    getAuthTime = createGetAuthTime(session);
  });

  it('should return authTime when it exists in session', async () => {
    const mockAuthTime = Math.floor(Date.now() / 1000);
    await session.set('authTime', mockAuthTime);
    const result = await getAuthTime();
    expect(result).toBe(mockAuthTime);
  });

  it('should return 0 when authTime does not exist in session', async () => {
    const result = await getAuthTime();
    expect(result).toBe(0);
  });
});
