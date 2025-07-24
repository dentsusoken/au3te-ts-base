import { describe, it, expect, vi } from 'vitest';
import { PushedAuthReqResponse } from '@vecrea/au3te-ts-common/schemas.par';
import { createProcessApiResponse } from '../processApiResponse';
import type { Headers } from '../../responseFactory';
import { defaultResponseFactory } from '../../responseFactory';
import { createResponseErrorFactory } from '../../responseErrorFactory';
import { ResponseError } from '../../ResponseError';

describe('processApiResponse', () => {
  describe('createProcessApiResponse', () => {
    const mockBuildUnknownActionMessage = vi.fn(
      (path, action) => `${path}: Unknown action: ${action}`
    );
    const mockPrepareHeaders = vi.fn(
      ({ dpopNonce }: { dpopNonce?: string | null }): Headers =>
        dpopNonce ? { 'DPoP-Nonce': dpopNonce } : {}
    );

    const responseErrorFactory = createResponseErrorFactory(
      defaultResponseFactory
    );

    const processApiResponse = createProcessApiResponse({
      path: 'test-path',
      responseFactory: defaultResponseFactory,
      responseErrorFactory,
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

      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError('Bad request content', expect.any(Response))
      );
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

      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError('Unauthorized content', expect.any(Response))
      );
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

      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError('Forbidden content', expect.any(Response))
      );
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

      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError('Payload too large content', expect.any(Response))
      );
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

      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError('Internal server error content', expect.any(Response))
      );
      expect(mockPrepareHeaders).toHaveBeenCalledWith({
        dpopNonce: 'test-nonce',
      });
    });

    it('should handle unknown action', async () => {
      const apiResponse = {
        action: 'UNKNOWN_ACTION',
        dpopNonce: 'test-nonce',
      } as unknown as PushedAuthReqResponse;

      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError(
          'test-path: Unknown action: UNKNOWN_ACTION',
          expect.any(Response)
        )
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
