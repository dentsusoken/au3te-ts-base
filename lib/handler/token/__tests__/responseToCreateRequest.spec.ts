import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createResponseToCreateRequest } from '../responseToCreateRequest';
import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';
import { defaultResponseFactory } from '../../core/responseFactory';
import { createResponseErrorFactory } from '../../core/responseErrorFactory';

/**
 * Tests for the responseToCreateRequest function factory
 */
describe('createResponseToCreateRequest', () => {
  const mockDetermineSubject = vi.fn();

  const responseErrorFactory = createResponseErrorFactory(
    defaultResponseFactory
  );

  const createRequest = createResponseToCreateRequest({
    grantType: 'urn:ietf:params:oauth:grant-type:token-exchange',
    determineSubject: mockDetermineSubject,
    responseErrorFactory,
  });

  beforeEach(() => {
    mockDetermineSubject.mockReset();
  });

  describe('with valid inputs', () => {
    it('should create request with valid parameters', async () => {
      const response = {
        clientId: 123,
        scopes: ['scope1', 'scope2'],
        resources: ['resource1'],
      } as TokenResponse;

      mockDetermineSubject.mockResolvedValue('test-subject');

      const result = await createRequest(response);

      expect(mockDetermineSubject).toHaveBeenCalledWith(
        response,
        responseErrorFactory
      );
      expect(result).toEqual({
        grantType: 'urn:ietf:params:oauth:grant-type:token-exchange',
        clientId: 123,
        subject: 'test-subject',
        scopes: ['scope1', 'scope2'],
        resources: ['resource1'],
      });
    });
  });

  describe('with invalid inputs', () => {
    it('should throw error for missing client ID', async () => {
      const response = {
        clientId: 0,
      } as TokenResponse;

      await expect(createRequest(response)).rejects.toThrow(
        'This authorization server does not allow unidentifiable clients to make token exchange requests.'
      );

      expect(mockDetermineSubject).not.toHaveBeenCalled();
    });
  });
});
