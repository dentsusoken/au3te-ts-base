import { describe, it, expect, vi } from 'vitest';
import { TokenFailResponse } from 'au3te-ts-common/schemas.token-fail';
import { createProcessApiResponse } from './processApiResponse';

describe('createProcessApiResponse', () => {
  const mockBuildUnknownActionMessage = vi.fn(
    (path, action) => `Unknown action: ${action} at ${path}`
  );
  const mockHeaders = { 'X-Custom-Header': 'test-value' };
  const processApiResponse = createProcessApiResponse({
    path: '/api/auth/token/fail',
    buildUnknownActionMessage: mockBuildUnknownActionMessage,
  });

  it('should handle BAD_REQUEST action', async () => {
    const apiResponse = {
      action: 'BAD_REQUEST',
      responseContent: 'Bad request response',
    } as TokenFailResponse;
    const response = await processApiResponse(apiResponse, mockHeaders);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Bad request response');
    expect(response.headers.get('X-Custom-Header')).toBe('test-value');
  });

  it('should handle INTERNAL_SERVER_ERROR action', async () => {
    const apiResponse = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: 'Internal server error content',
    } as TokenFailResponse;
    const response = await processApiResponse(apiResponse, mockHeaders);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Internal server error content');
    expect(response.headers.get('X-Custom-Header')).toBe('test-value');
  });

  it('should handle unknown action', async () => {
    const apiResponse = {
      action: 'UNKNOWN_ACTION',
    } as unknown as TokenFailResponse;
    const response = await processApiResponse(apiResponse, mockHeaders);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe(
      'Unknown action: UNKNOWN_ACTION at /api/auth/token/fail'
    );
    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      '/api/auth/token/fail',
      'UNKNOWN_ACTION'
    );
  });
});
