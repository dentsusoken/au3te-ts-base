import { describe, it, expect, vi, afterEach } from 'vitest';
import { createPost } from './post';
//import { runAsyncCatching } from './asyncUtils'; // Adjust import path as needed

describe('createPost', () => {
  const mockToApiRequest = vi.fn();
  const mockProcessApiRequest = vi.fn();
  const mockProcessApiResponse = vi.fn();
  const mockRecoverResponseResult = vi.fn();

  const post = createPost({
    toApiRequest: mockToApiRequest,
    processApiRequest: mockProcessApiRequest,
    processApiResponse: mockProcessApiResponse,
    recoverResponseResult: mockRecoverResponseResult,
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should process a request successfully', async () => {
    const mockRequest = {} as Request;
    const mockApiRequest = {
      /* mock API request */
    };
    const mockApiResponse = {
      /* mock API response */
    };
    const mockResponse = new Response('Success', { status: 200 });

    mockToApiRequest.mockResolvedValue(mockApiRequest);
    mockProcessApiRequest.mockResolvedValue(mockApiResponse);
    mockProcessApiResponse.mockResolvedValue(mockResponse);
    mockRecoverResponseResult.mockResolvedValue(mockResponse);

    const result = await post(mockRequest);

    expect(result).toBe(mockResponse);
    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).toHaveBeenCalledWith(mockApiResponse);
    expect(mockRecoverResponseResult).toHaveBeenCalled();
  });

  it('should handle errors thrown by toApiRequest', async () => {
    const mockRequest = {} as Request;
    const mockError = new Error('Test error');
    const mockErrorResponse = new Response('Processed error message', {
      status: 500,
    });

    mockToApiRequest.mockRejectedValue(mockError);
    mockRecoverResponseResult.mockResolvedValue(mockErrorResponse);

    const result = await post(mockRequest);

    expect(result).toBe(mockErrorResponse);
    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockRecoverResponseResult).toHaveBeenCalled();
    const resultPassedToRecover = mockRecoverResponseResult.mock.calls[0][0];
    expect(resultPassedToRecover.isFailure()).toBe(true);
  });

  it('should handle errors thrown by processApiRequest', async () => {
    const mockRequest = {} as Request;
    const mockApiRequest = {
      /* mock API request */
    };
    const mockError = new Error('Process API request error');
    const mockErrorResponse = new Response('Processed error message', {
      status: 500,
    });

    mockToApiRequest.mockResolvedValue(mockApiRequest);
    mockProcessApiRequest.mockRejectedValue(mockError);
    mockRecoverResponseResult.mockResolvedValue(mockErrorResponse);

    const result = await post(mockRequest);

    expect(result).toBe(mockErrorResponse);
    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).not.toHaveBeenCalled();
    expect(mockRecoverResponseResult).toHaveBeenCalled();
    const resultPassedToRecover = mockRecoverResponseResult.mock.calls[0][0];
    expect(resultPassedToRecover.isFailure()).toBe(true);
    expect(resultPassedToRecover.error).toBe(mockError);
  });

  it('should handle errors thrown by processApiResponse', async () => {
    const mockRequest = {} as Request;
    const mockApiRequest = {
      /* mock API request */
    };
    const mockApiResponse = {
      /* mock API response */
    };
    const mockError = new Error('Process response error');
    const mockErrorResponse = new Response('Processed error message', {
      status: 500,
    });

    mockToApiRequest.mockResolvedValue(mockApiRequest);
    mockProcessApiRequest.mockResolvedValue(mockApiResponse);
    mockProcessApiResponse.mockRejectedValue(mockError);
    mockRecoverResponseResult.mockResolvedValue(mockErrorResponse);

    const result = await post(mockRequest);

    expect(result).toBe(mockErrorResponse);
    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).toHaveBeenCalledWith(mockApiResponse);
    expect(mockRecoverResponseResult).toHaveBeenCalled();
    const resultPassedToRecover = mockRecoverResponseResult.mock.calls[0][0];
    //expect(resultPassedToRecover).toBeInstanceOf(Result);
    expect(resultPassedToRecover.isFailure()).toBe(true);
  });
});
