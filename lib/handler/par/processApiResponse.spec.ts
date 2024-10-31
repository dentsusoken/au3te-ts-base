import { describe, it, expect, vi } from 'vitest';
import { PushedAuthReqResponse } from 'au3te-ts-common/schemas.par';
import { prepareHeaders, createProcessApiResponse } from './processApiResponse';

describe('processApiResponse', () => {
  describe('prepareHeaders', () => {
    it('should return empty headers when dpopNonce is not provided', () => {
      const apiResponse = {} as PushedAuthReqResponse;
      const headers = prepareHeaders(apiResponse);
      expect(headers).toEqual({});
    });

    it('should include DPoP-Nonce header when dpopNonce is provided', () => {
      const apiResponse = { dpopNonce: 'test-nonce' } as PushedAuthReqResponse;
      const headers = prepareHeaders(apiResponse);
      expect(headers).toEqual({ 'DPoP-Nonce': 'test-nonce' });
    });
  });

  describe('createProcessApiResponse', () => {
    const mockBuildUnknownActionMessage = vi.fn(
      (path, action) => `${path}: Unknown action: ${action}`
    );
    const processApiResponse = createProcessApiResponse({
      path: 'test-path',
      buildUnknownActionMessage: mockBuildUnknownActionMessage,
    });

    it('should handle CREATED action', async () => {
      const apiResponse = {
        action: 'CREATED',
        responseContent: 'Created content',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(201);
      expect(await response.text()).toBe('Created content');
    });

    it('should handle BAD_REQUEST action', async () => {
      const apiResponse = {
        action: 'BAD_REQUEST',
        responseContent: 'Bad request content',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Bad request content');
    });

    it('should handle UNAUTHORIZED action', async () => {
      const apiResponse = {
        action: 'UNAUTHORIZED',
        responseContent: 'Unauthorized content',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(401);
      expect(await response.text()).toBe('Unauthorized content');
    });

    it('should handle FORBIDDEN action', async () => {
      const apiResponse = {
        action: 'FORBIDDEN',
        responseContent: 'Forbidden content',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(403);
      expect(await response.text()).toBe('Forbidden content');
    });

    it('should handle PAYLOAD_TOO_LARGE action', async () => {
      const apiResponse = {
        action: 'PAYLOAD_TOO_LARGE',
        responseContent: 'Payload too large content',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(413);
      expect(await response.text()).toBe('Payload too large content');
    });

    it('should handle INTERNAL_SERVER_ERROR action', async () => {
      const apiResponse = {
        action: 'INTERNAL_SERVER_ERROR',
        responseContent: 'Internal server error content',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(500);
      expect(await response.text()).toBe('Internal server error content');
    });

    it('should handle unknown action', async () => {
      const apiResponse = {
        action: 'UNKNOWN_ACTION',
      } as unknown as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(500);
      expect(await response.text()).toBe(
        'test-path: Unknown action: UNKNOWN_ACTION'
      );
      expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
        'test-path',
        'UNKNOWN_ACTION'
      );
    });

    it('should include DPoP-Nonce header when provided', async () => {
      const apiResponse = {
        action: 'CREATED',
        responseContent: 'Created content',
        dpopNonce: 'test-nonce',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.headers.get('DPoP-Nonce')).toBe('test-nonce');
    });
  });
});
