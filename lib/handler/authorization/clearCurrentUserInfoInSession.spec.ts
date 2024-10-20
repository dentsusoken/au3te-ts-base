import { describe, it, expect, vi } from 'vitest';
import { BaseSession } from '../../session/BaseSession';
import { defaultClearCurrentUserInfoInSession } from './clearCurrentUserInfoInSession';

describe('defaultClearCurrentUserInfoInSession', () => {
  it('should delete user and authTime from the session', async () => {
    // Create a mock BaseSession
    const mockSession: BaseSession = {
      deleteBatch: vi.fn().mockResolvedValue(undefined),
    } as unknown as BaseSession;

    // Call the function
    await defaultClearCurrentUserInfoInSession(mockSession);

    // Check if deleteBatch was called with correct arguments
    expect(mockSession.deleteBatch).toHaveBeenCalledWith('user', 'authTime');
    expect(mockSession.deleteBatch).toHaveBeenCalledTimes(1);
  });
});
