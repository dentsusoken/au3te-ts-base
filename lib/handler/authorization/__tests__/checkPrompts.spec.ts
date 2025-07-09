import { describe, it, expect } from 'vitest';
import { defaultCheckPrompts } from '../checkPrompts';

describe('defaultCheckPrompts', () => {
  // Test when prompts is undefined
  it('should return false when prompts is undefined', () => {
    expect(defaultCheckPrompts(undefined)).toBe(false);
  });

  // Test when prompts is an empty array
  it('should return false when prompts is an empty array', () => {
    expect(defaultCheckPrompts([])).toBe(false);
  });

  // Test when prompts includes 'login'
  it('should return true when prompts includes "login"', () => {
    expect(defaultCheckPrompts(['login'])).toBe(true);
    expect(defaultCheckPrompts(['consent', 'login', 'select_account'])).toBe(
      true
    );
  });

  // Test when prompts does not include 'login'
  it('should return false when prompts does not include "login"', () => {
    expect(defaultCheckPrompts(['consent'])).toBe(false);
    expect(defaultCheckPrompts(['consent', 'select_account'])).toBe(false);
  });
});
