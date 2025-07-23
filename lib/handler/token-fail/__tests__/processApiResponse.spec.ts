import { describe, it, expect, vi } from 'vitest';
import { TokenFailResponse } from '@vecrea/au3te-ts-common/schemas.token-fail';
import { createProcessApiResponse } from '../processApiResponse';
import { defaultResponseFactory } from '../../responseFactory';
import { createResponseErrorFactory } from '../../responseErrorFactory';
import { ResponseError } from '../../ResponseError';

describe('createProcessApiResponse', () => {
  const mockBuildUnknownActionMessage = vi.fn(
    (path, action) => `Unknown action: ${action} at ${path}`
  );
  const mockHeaders = { 'X-Custom-Header': 'test-value' };

  const responseErrorFactory = createResponseErrorFactory(
    defaultResponseFactory
  );

  const processApiResponse = createProcessApiResponse({
    path: '/api/auth/token/fail',
    responseFactory: defaultResponseFactory,
    responseErrorFactory,
    buildUnknownActionMessage: mockBuildUnknownActionMessage,
  });

  it('should handle BAD_REQUEST action', async () => {
    const apiResponse = {
      action: 'BAD_REQUEST',
      responseContent: 'Bad request response',
    } as TokenFailResponse;

    await expect(processApiResponse(apiResponse, mockHeaders)).rejects.toThrow(
      new ResponseError('Bad request response', expect.any(Response))
    );
  });

  it('should handle INTERNAL_SERVER_ERROR action', async () => {
    const apiResponse = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: 'Internal server error content',
    } as TokenFailResponse;

    await expect(processApiResponse(apiResponse, mockHeaders)).rejects.toThrow(
      new ResponseError('Internal server error content', expect.any(Response))
    );
  });

  it('should handle unknown action', async () => {
    const apiResponse = {
      action: 'UNKNOWN_ACTION',
    } as unknown as TokenFailResponse;

    await expect(processApiResponse(apiResponse, mockHeaders)).rejects.toThrow(
      new ResponseError(
        'Unknown action: UNKNOWN_ACTION at /api/auth/token/fail',
        expect.any(Response)
      )
    );
    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      '/api/auth/token/fail',
      'UNKNOWN_ACTION'
    );
  });
});
