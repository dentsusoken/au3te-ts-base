import { describe, it, expect, vi } from 'vitest';
import { TokenIssueResponse } from '@vecrea/au3te-ts-common/schemas.token-issue';
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
    path: '/api/auth/token/issue',
    responseFactory: defaultResponseFactory,
    responseErrorFactory,
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

    await expect(processApiResponse(apiResponse, mockHeaders)).rejects.toThrow(
      new ResponseError('Internal server error content', expect.any(Response))
    );
  });

  it('should handle unknown action', async () => {
    const apiResponse = {
      action: 'UNKNOWN_ACTION',
    } as unknown as TokenIssueResponse;

    await expect(processApiResponse(apiResponse, mockHeaders)).rejects.toThrow(
      new ResponseError(
        'Unknown action: UNKNOWN_ACTION at /api/auth/token/issue',
        expect.any(Response)
      )
    );
    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      '/api/auth/token/issue',
      'UNKNOWN_ACTION'
    );
  });
});
