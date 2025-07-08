import { describe, it, expect, vi } from 'vitest';
import { TokenIssueResponse } from '@vecrea/au3te-ts-common/schemas.token-issue';
import { createProcessApiResponse } from './processApiResponse';

describe('createProcessApiResponse', () => {
  const mockBuildUnknownActionMessage = vi.fn(
    (path, action) => `Unknown action: ${action} at ${path}`
  );
  const mockHeaders = { 'X-Custom-Header': 'test-value' };
  const processApiResponse = createProcessApiResponse({
    path: '/api/auth/token/issue',
    buildUnknownActionMessage: mockBuildUnknownActionMessage,
  });

  it('should handle OK action', async () => {
    const apiResponse = {
      action: 'OK',
      responseContent: 'Success response',
    } as TokenIssueResponse;
    const response = await processApiResponse(apiResponse, mockHeaders);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Success response');
    expect(response.headers.get('X-Custom-Header')).toBe('test-value');
  });

  it('should handle INTERNAL_SERVER_ERROR action', async () => {
    const apiResponse = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: 'Internal server error content',
    } as TokenIssueResponse;
    const response = await processApiResponse(apiResponse, mockHeaders);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Internal server error content');
    expect(response.headers.get('X-Custom-Header')).toBe('test-value');
  });

  it('should handle unknown action', async () => {
    const apiResponse = {
      action: 'UNKNOWN_ACTION',
    } as unknown as TokenIssueResponse;
    const response = await processApiResponse(apiResponse, mockHeaders);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe(
      'Unknown action: UNKNOWN_ACTION at /api/auth/token/issue'
    );
    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      '/api/auth/token/issue',
      'UNKNOWN_ACTION'
    );
  });
});
