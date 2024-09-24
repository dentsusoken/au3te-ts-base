import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createClearCurrentUserInfoInSessionIfNecessary,
  ClearCurrentUserInfoInSessionIfNecessary,
} from './clearCurrentUserInfoInSessionIfNecessary';
import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';

describe('createClearCurrentUserInfoInSessionIfNecessary', () => {
  const mockCheckPrompts = vi.fn();
  const mockCheckAuthAge = vi.fn();
  const mockClearCurrentUserInfoInSession = vi.fn();
  let clearCurrentUserInfoInSessionIfNecessary: ClearCurrentUserInfoInSessionIfNecessary;

  beforeEach(() => {
    vi.resetAllMocks();
    clearCurrentUserInfoInSessionIfNecessary =
      createClearCurrentUserInfoInSessionIfNecessary({
        checkPrompts: mockCheckPrompts,
        checkAuthAge: mockCheckAuthAge,
        clearCurrentUserInfoInSession: mockClearCurrentUserInfoInSession,
      });
  });

  it('should clear session when checkPrompts returns true', async () => {
    mockCheckPrompts.mockReturnValue(true);
    mockCheckAuthAge.mockResolvedValue(false);

    const response = {} as AuthorizationResponse;
    await clearCurrentUserInfoInSessionIfNecessary(response);

    expect(mockCheckPrompts).toHaveBeenCalledWith(response);
    expect(mockCheckAuthAge).not.toHaveBeenCalled();
    expect(mockClearCurrentUserInfoInSession).toHaveBeenCalled();
  });

  it('should clear session when checkAuthAge returns true', async () => {
    mockCheckPrompts.mockReturnValue(false);
    mockCheckAuthAge.mockResolvedValue(true);

    const response = {} as AuthorizationResponse;
    await clearCurrentUserInfoInSessionIfNecessary(response);

    expect(mockCheckPrompts).toHaveBeenCalledWith(response);
    expect(mockCheckAuthAge).toHaveBeenCalledWith(response);
    expect(mockClearCurrentUserInfoInSession).toHaveBeenCalled();
  });

  it('should not clear session when both checks return false', async () => {
    mockCheckPrompts.mockReturnValue(false);
    mockCheckAuthAge.mockResolvedValue(false);

    const response = {} as AuthorizationResponse;
    await clearCurrentUserInfoInSessionIfNecessary(response);

    expect(mockCheckPrompts).toHaveBeenCalledWith(response);
    expect(mockCheckAuthAge).toHaveBeenCalledWith(response);
    expect(mockClearCurrentUserInfoInSession).not.toHaveBeenCalled();
  });
});
