import { describe, it, expect } from 'vitest';
import {
  defaultDetermineSubject4TokenExchange,
  determineSubjectBySubjectTokenInfo,
  determineSubjectBySubjectToken,
} from '../determineSubject4TokenExchange';
import { TokenInfo } from '@vecrea/au3te-ts-common/schemas.common';
import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';

describe('Token Exchange Subject Determination', () => {
  // Test suite for determineSubjectBySubjectTokenInfo
  describe('determineSubjectBySubjectTokenInfo', () => {
    it('should extract subject from valid token info', async () => {
      const tokenInfo: TokenInfo = { subject: 'test-subject' };
      const result = await determineSubjectBySubjectTokenInfo(tokenInfo);
      expect(result).toBe('test-subject');
    });

    it('should throw error when token info is undefined', async () => {
      await expect(
        determineSubjectBySubjectTokenInfo(undefined)
      ).rejects.toThrow('Subject token info is missing');
    });

    it('should throw error when subject is missing in token info', async () => {
      const tokenInfo: TokenInfo = {};
      await expect(
        determineSubjectBySubjectTokenInfo(tokenInfo)
      ).rejects.toThrow('Subject is missing in the token info');
    });
  });

  // Test suite for determineSubjectBySubjectToken
  describe('determineSubjectBySubjectToken', () => {
    // Test JWT with header: {"alg":"none"} and payload: {"sub":"test-subject"}
    const validJwt = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJ0ZXN0LXN1YmplY3QifQ.';

    it('should extract subject from valid JWT', async () => {
      const result = await determineSubjectBySubjectToken(validJwt);
      expect(result).toBe('test-subject');
    });

    it('should throw error when subject token is undefined', async () => {
      await expect(determineSubjectBySubjectToken(undefined)).rejects.toThrow(
        'Subject token is missing'
      );
    });

    it('should throw error for invalid JWT format', async () => {
      await expect(
        determineSubjectBySubjectToken('invalid-jwt')
      ).rejects.toThrow();
    });
  });

  // Test suite for main determineSubject4TokenExchange function
  describe('defaultDetermineSubject4TokenExchange', () => {
    it('should handle access token type', async () => {
      const response = {
        action: 'TOKEN_EXCHANGE',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:access_token',
        subjectTokenInfo: { subject: 'test-subject' },
      } as TokenResponse;
      const result = await defaultDetermineSubject4TokenExchange(response);
      expect(result).toBe('test-subject');
    });

    it('should handle refresh token type', async () => {
      const response = {
        action: 'TOKEN_EXCHANGE',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:refresh_token',
        subjectTokenInfo: { subject: 'test-subject' },
      } as TokenResponse;
      const result = await defaultDetermineSubject4TokenExchange(response);
      expect(result).toBe('test-subject');
    });

    it('should handle JWT token type', async () => {
      const response = {
        action: 'TOKEN_EXCHANGE',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:jwt',
        subjectToken: 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJ0ZXN0LXN1YmplY3QifQ.',
      } as TokenResponse;
      const result = await defaultDetermineSubject4TokenExchange(response);
      expect(result).toBe('test-subject');
    });

    it('should handle ID token type', async () => {
      const response = {
        action: 'TOKEN_EXCHANGE',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:id_token',
        subjectToken: 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJ0ZXN0LXN1YmplY3QifQ.',
      } as TokenResponse;
      const result = await defaultDetermineSubject4TokenExchange(response);
      expect(result).toBe('test-subject');
    });

    it('should throw error for unsupported token type', async () => {
      const response = {
        action: 'TOKEN_EXCHANGE',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:saml2',
      } as TokenResponse;
      await expect(
        defaultDetermineSubject4TokenExchange(response)
      ).rejects.toThrow('Unsupported subject token type');
    });

    it('should throw error when JWT token type is specified but token is missing', async () => {
      const response = {
        action: 'TOKEN_EXCHANGE',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:jwt',
        subjectToken: undefined,
      } as TokenResponse;
      await expect(
        defaultDetermineSubject4TokenExchange(response)
      ).rejects.toThrow('Subject token is missing');
    });

    it('should throw error when ID token type is specified but token is missing', async () => {
      const response = {
        action: 'TOKEN_EXCHANGE',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:id_token',
        subjectToken: undefined,
      } as TokenResponse;
      await expect(
        defaultDetermineSubject4TokenExchange(response)
      ).rejects.toThrow('Subject token is missing');
    });

    it('should extract subject from access token info', async () => {
      const response = {
        subjectTokenType: 'urn:ietf:params:oauth:token-type:access_token',
        subjectTokenInfo: {
          subject: 'test-subject',
        },
      } as TokenResponse;

      const result = await defaultDetermineSubject4TokenExchange(response);
      expect(result).toBe('test-subject');
    });
  });
});
