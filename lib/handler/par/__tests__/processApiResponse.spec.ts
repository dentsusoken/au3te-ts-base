import { describe, it, expect, vi } from 'vitest';
import { PushedAuthReqResponse } from '@vecrea/au3te-ts-common/schemas.par';
import { createProcessApiResponse } from '../processApiResponse';
import type { Headers } from '../../../utils/responseFactory';

describe('processApiResponse', () => {
  describe('createProcessApiResponse', () => {
    const mockBuildUnknownActionMessage = vi.fn(
      (path, action) => `${path}: Unknown action: ${action}`
    );
    const mockPrepareHeaders = vi.fn(
      ({ dpopNonce }: { dpopNonce?: string }): Headers =>
        dpopNonce ? { 'DPoP-Nonce': dpopNonce } : {}
    );

    const processApiResponse = createProcessApiResponse({
      path: 'test-path',
      buildUnknownActionMessage: mockBuildUnknownActionMessage,
      prepareHeaders: mockPrepareHeaders,
    });

    it('should handle CREATED action', async () => {
      const apiResponse = {
        action: 'CREATED',
        responseContent: 'Created content',
        dpopNonce: 'test-nonce',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(201);
      expect(await response.text()).toBe('Created content');
      expect(mockPrepareHeaders).toHaveBeenCalledWith({
        dpopNonce: 'test-nonce',
      });
    });

    it('should handle BAD_REQUEST action', async () => {
      const apiResponse = {
        action: 'BAD_REQUEST',
        responseContent: 'Bad request content',
        dpopNonce: 'test-nonce',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Bad request content');
      expect(mockPrepareHeaders).toHaveBeenCalledWith({
        dpopNonce: 'test-nonce',
      });
    });

    it('should handle UNAUTHORIZED action', async () => {
      const apiResponse = {
        action: 'UNAUTHORIZED',
        responseContent: 'Unauthorized content',
        dpopNonce: 'test-nonce',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(401);
      expect(await response.text()).toBe('Unauthorized content');
      expect(mockPrepareHeaders).toHaveBeenCalledWith({
        dpopNonce: 'test-nonce',
      });
    });

    it('should handle FORBIDDEN action', async () => {
      const apiResponse = {
        action: 'FORBIDDEN',
        responseContent: 'Forbidden content',
        dpopNonce: 'test-nonce',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(403);
      expect(await response.text()).toBe('Forbidden content');
      expect(mockPrepareHeaders).toHaveBeenCalledWith({
        dpopNonce: 'test-nonce',
      });
    });

    it('should handle PAYLOAD_TOO_LARGE action', async () => {
      const apiResponse = {
        action: 'PAYLOAD_TOO_LARGE',
        responseContent: 'Payload too large content',
        dpopNonce: 'test-nonce',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(413);
      expect(await response.text()).toBe('Payload too large content');
      expect(mockPrepareHeaders).toHaveBeenCalledWith({
        dpopNonce: 'test-nonce',
      });
    });

    it('should handle INTERNAL_SERVER_ERROR action', async () => {
      const apiResponse = {
        action: 'INTERNAL_SERVER_ERROR',
        responseContent: 'Internal server error content',
        dpopNonce: 'test-nonce',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(500);
      expect(await response.text()).toBe('Internal server error content');
      expect(mockPrepareHeaders).toHaveBeenCalledWith({
        dpopNonce: 'test-nonce',
      });
    });

    it('should handle unknown action', async () => {
      const apiResponse = {
        action: 'UNKNOWN_ACTION',
        dpopNonce: 'test-nonce',
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
      expect(mockPrepareHeaders).toHaveBeenCalledWith({
        dpopNonce: 'test-nonce',
      });
    });

    it('should handle missing dpopNonce', async () => {
      const apiResponse = {
        action: 'CREATED',
        responseContent: 'Created content',
      } as PushedAuthReqResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(201);
      expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: undefined });
    });
  });
});
