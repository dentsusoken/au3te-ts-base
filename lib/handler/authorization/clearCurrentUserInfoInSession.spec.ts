import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createClearCurrentUserInfoInSession,
  ClearCurrentUserInfoInSession,
} from './clearCurrentUserInfoInSession';
import { BaseSession } from '../../session/BaseSession';

describe('createClearCurrentUserInfoInSession', () => {
  let mockSession: BaseSession;
  let clearCurrentUserInfoInSession: ClearCurrentUserInfoInSession;

  beforeEach(() => {
    mockSession = {
      deleteBatch: vi.fn().mockResolvedValue(undefined),
    } as unknown as BaseSession;

    clearCurrentUserInfoInSession =
      createClearCurrentUserInfoInSession(mockSession);
  });

  it('should call session.deleteBatch with correct parameters', async () => {
    await clearCurrentUserInfoInSession();

    expect(mockSession.deleteBatch).toHaveBeenCalledWith('user', 'authTime');
    expect(mockSession.deleteBatch).toHaveBeenCalledTimes(1);
  });

  it('should return a Promise that resolves to void', async () => {
    const result = await clearCurrentUserInfoInSession();

    expect(result).toBeUndefined();
  });

  it('should propagate errors from session.deleteBatch', async () => {
    const error = new Error('Test error');
    vi.mocked(mockSession.deleteBatch).mockRejectedValueOnce(error);

    await expect(clearCurrentUserInfoInSession()).rejects.toThrow('Test error');
  });
});
