import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { createCheckAuthAge, CheckAuthAge } from './checkAuthAge';
import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';

describe('createCheckMaxAge', () => {
  let mockGetAuthTime: Mock<[], Promise<number>>;
  let checkMaxAge: CheckAuthAge;

  beforeEach(() => {
    vi.useFakeTimers();
    mockGetAuthTime = vi.fn();
    checkMaxAge = createCheckAuthAge(mockGetAuthTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return false when maxAge is 0', async () => {
    const response = { maxAge: 0 } as AuthorizationResponse;
    const result = await checkMaxAge(response);
    expect(result).toBe(false);
    expect(mockGetAuthTime).not.toHaveBeenCalled();
  });

  it('should return false when maxAge is undefined', async () => {
    const response = {} as AuthorizationResponse;
    const result = await checkMaxAge(response);
    expect(result).toBe(false);
    expect(mockGetAuthTime).not.toHaveBeenCalled();
  });

  it('should return true when authAge is greater than maxAge', async () => {
    const now = 1000;
    vi.setSystemTime(now * 1000); // setSystemTime uses milliseconds
    const authTime = 500;
    mockGetAuthTime.mockResolvedValue(authTime);
    const response = { maxAge: 400 } as AuthorizationResponse;

    const result = await checkMaxAge(response);

    expect(result).toBe(true);
    expect(mockGetAuthTime).toHaveBeenCalledOnce();
  });

  it('should return false when authAge is equal to maxAge', async () => {
    const now = 1000;
    vi.setSystemTime(now * 1000);
    const authTime = 600;
    mockGetAuthTime.mockResolvedValue(authTime);
    const response = { maxAge: 400 } as AuthorizationResponse;

    const result = await checkMaxAge(response);

    expect(result).toBe(false);
    expect(mockGetAuthTime).toHaveBeenCalledOnce();
  });

  it('should return false when authAge is less than maxAge', async () => {
    const now = 1000;
    vi.setSystemTime(now * 1000);
    const authTime = 700;
    mockGetAuthTime.mockResolvedValue(authTime);
    const response = { maxAge: 400 } as AuthorizationResponse;

    const result = await checkMaxAge(response);

    expect(result).toBe(false);
    expect(mockGetAuthTime).toHaveBeenCalledOnce();
  });
});
