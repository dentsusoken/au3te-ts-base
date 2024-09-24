import { describe, it, expect } from 'vitest';
import { defaultCheckPrompts } from './checkPrompts';
import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';

describe('defaultCheckPrompts', () => {
  it('should return true when prompts includes "login"', () => {
    const response = {
      prompts: ['login', 'consent'],
    } as AuthorizationResponse;
    expect(defaultCheckPrompts(response)).toBe(true);
  });

  it('should return false when prompts does not include "login"', () => {
    const response = {
      prompts: ['consent'],
    } as AuthorizationResponse;
    expect(defaultCheckPrompts(response)).toBe(false);
  });

  it('should return false when prompts is undefined', () => {
    const response = {} as AuthorizationResponse;
    expect(defaultCheckPrompts(response)).toBe(false);
  });
});
