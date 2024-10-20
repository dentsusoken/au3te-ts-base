import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defaultCheckAuthAge } from './checkAuthAge';

describe('defaultCheckAuthAge', () => {
  // Mock the current time
  const now = 1000000000;
  const originalDateNow = Date.now;

  beforeEach(() => {
    Date.now = vi.fn(() => now * 1000); // Convert to milliseconds
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  it('should return false when maxAge is 0', () => {
    expect(defaultCheckAuthAge(now - 100, 0)).toBe(false);
  });

  it('should return false when maxAge is undefined', () => {
    expect(defaultCheckAuthAge(now - 100, undefined)).toBe(false);
  });

  it('should return false when auth age is less than maxAge', () => {
    expect(defaultCheckAuthAge(now - 300, 600)).toBe(false);
  });

  it('should return true when auth age is greater than maxAge', () => {
    expect(defaultCheckAuthAge(now - 700, 600)).toBe(true);
  });

  it('should return false when auth age is equal to maxAge', () => {
    expect(defaultCheckAuthAge(now - 600, 600)).toBe(false);
  });
});
