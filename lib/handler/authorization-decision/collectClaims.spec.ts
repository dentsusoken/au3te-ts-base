import { describe, expect, it, vi } from 'vitest';
import { defaultCollectClaims, getClaim } from './collectClaims';
import { User } from '@vecrea/au3te-ts-common/schemas.common';

describe('collectClaims', () => {
  describe('defaultCollectClaims', () => {
    it('should return undefined when no claim names are provided', () => {
      const result = defaultCollectClaims(undefined, undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined when empty claim names array is provided', () => {
      const result = defaultCollectClaims([], undefined);
      expect(result).toBeUndefined();
    });

    it('should collect claims from user data', () => {
      const user: User = {
        subject: 'user123',
        givenName: 'John',
        familyName: 'Doe',
        email: 'john@example.com',
      };

      const claimNames = ['given_name', 'family_name', 'email'];
      const result = defaultCollectClaims(claimNames, user);

      expect(result).toEqual({
        given_name: 'John',
        family_name: 'Doe',
        email: 'john@example.com',
      });
    });

    it('should handle claims with tags', () => {
      const user: User = {
        subject: 'user123',
        email: 'john@example.com',
      };

      const claimNames = ['email#essential'];
      const result = defaultCollectClaims(claimNames, user);

      expect(result).toEqual({
        'email#essential': 'john@example.com',
      });
    });

    it('should skip invalid claim names', () => {
      const user: User = {
        subject: 'user123',
        email: 'john@example.com',
      };

      const claimNames = ['', 'email', '#tag'];
      const result = defaultCollectClaims(claimNames, user);

      expect(result).toEqual({
        email: 'john@example.com',
      });
    });
  });

  describe('getClaim', () => {
    it('should generate UUID for txn claim', () => {
      const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
      vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockUUID);

      const result = getClaim('txn', undefined);
      expect(result).toBe(mockUUID);
    });

    it('should return placeholder for claims starting with :', () => {
      const result = getClaim(':custom', undefined);
      expect(result).toBe('placeholder');
    });

    it('should return undefined when user is not provided', () => {
      const result = getClaim('email', undefined);
      expect(result).toBeUndefined();
    });

    it('should convert snake_case to camelCase and get claim from user', () => {
      const user: User = {
        subject: 'user123',
        givenName: 'John',
        familyName: 'Doe',
      };

      expect(getClaim('given_name', user)).toBe('John');
      expect(getClaim('family_name', user)).toBe('Doe');
    });

    it('should return undefined for non-existent claims', () => {
      const user: User = {
        subject: 'user123',
      };

      const result = getClaim('non_existent_claim', user);
      expect(result).toBeUndefined();
    });
  });
});
