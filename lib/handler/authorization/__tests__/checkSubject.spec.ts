import { describe, it, expect } from 'vitest';
import { defaultCheckSubject } from '../checkSubject';

describe('defaultCheckSubject', () => {
  // Test case: both subjects are undefined
  it('should return false when both subjects are undefined', () => {
    expect(defaultCheckSubject(undefined, undefined)).toBe(false);
  });

  // Test case: currentSubject is undefined
  it('should return false when currentSubject is undefined', () => {
    expect(defaultCheckSubject(undefined, 'savedSubject')).toBe(false);
  });

  // Test case: savedSubject is undefined
  it('should return false when savedSubject is undefined', () => {
    expect(defaultCheckSubject('currentSubject', undefined)).toBe(false);
  });

  // Test case: subjects are different
  it('should return true when subjects are different', () => {
    expect(defaultCheckSubject('subject1', 'subject2')).toBe(true);
  });

  // Test case: subjects are the same
  it('should return false when subjects are the same', () => {
    expect(defaultCheckSubject('sameSubject', 'sameSubject')).toBe(false);
  });
});
