import { describe, it, expect, vi, afterEach } from 'vitest';
import { createPost } from './post';
import { AuthorizationFailRequest } from 'au3te-ts-common/schemas.authorization.fail';

describe('createPost', () => {
  const mockProcessApiRequest = vi.fn();
  const mockProcessApiResponse = vi.fn();
  const mockRecoverResponseResult = vi.fn();

  const post = createPost({
    processApiRequest: mockProcessApiRequest,
    processApiResponse: mockProcessApiResponse,
    recoverResponseResult: mockRecoverResponseResult,
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should process a request successfully', async () => {
    const mockApiRequest: AuthorizationFailRequest = {
      reason: 'NOT_LOGGED_IN',
      /* mock API request */
    };
    const mockApiResponse = {
      /* mock API response */
    };
    const mockResponse = new Response('Success', { status: 200 });

    mockProcessApiRequest.mockResolvedValue(mockApiResponse);
    mockProcessApiResponse.mockResolvedValue(mockResponse);
    mockRecoverResponseResult.mockResolvedValue(mockResponse);

    const result = await post(mockApiRequest);

    expect(result).toBe(mockResponse);
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).toHaveBeenCalledWith(mockApiResponse);
    expect(mockRecoverResponseResult).toHaveBeenCalled();
  });

  it('should handle errors thrown by processApiRequest', async () => {
    const mockApiRequest: AuthorizationFailRequest = {
      reason: 'NOT_LOGGED_IN',
      /* mock API request */
    };
    const mockError = new Error('Process API request error');
    const mockErrorResponse = new Response('Processed error message', {
      status: 500,
    });

    mockProcessApiRequest.mockRejectedValue(mockError);
    mockRecoverResponseResult.mockResolvedValue(mockErrorResponse);

    const result = await post(mockApiRequest);

    expect(result).toBe(mockErrorResponse);
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).not.toHaveBeenCalled();
    expect(mockRecoverResponseResult).toHaveBeenCalled();
  });

  it('should handle errors thrown by processApiResponse', async () => {
    const mockApiRequest: AuthorizationFailRequest = {
      reason: 'NOT_LOGGED_IN',
      /* mock API request */
    };
    const mockApiResponse = {
      /* mock API response */
    };
    const mockError = new Error('Process response error');
    const mockErrorResponse = new Response('Processed error message', {
      status: 500,
    });

    mockProcessApiRequest.mockResolvedValue(mockApiResponse);
    mockProcessApiResponse.mockRejectedValue(mockError);
    mockRecoverResponseResult.mockResolvedValue(mockErrorResponse);

    const result = await post(mockApiRequest);

    expect(result).toBe(mockErrorResponse);
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).toHaveBeenCalledWith(mockApiResponse);
    expect(mockRecoverResponseResult).toHaveBeenCalled();
  });
});
