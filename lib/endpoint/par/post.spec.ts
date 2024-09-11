import { describe, it, expect, vi } from 'vitest';
import { createPost } from './post';
//import { runAsyncCatching } from './asyncUtils'; // Adjust import path as needed

describe('createPost', () => {
  const mockToApiRequest = vi.fn();
  const mockProcessApiRequest = vi.fn();
  const mockProcessApiResponse = vi.fn();
  const mockProcessError = vi.fn();

  const post = createPost({
    toApiRequest: mockToApiRequest,
    processApiRequest: mockProcessApiRequest,
    processApiResponse: mockProcessApiResponse,
    processError: mockProcessError,
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

    const result = await post(mockRequest);

    expect(result).toBe(mockResponse);
    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).toHaveBeenCalledWith(mockApiResponse);
  });

  it('should handle errors and recover', async () => {
    const mockRequest = {} as Request;
    const mockError = new Error('Test error');

    mockToApiRequest.mockRejectedValue(mockError);
    mockProcessError.mockResolvedValue('Processed error message');

    const result = await post(mockRequest);

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(500); // Internal Server Error status

    const responseBody = await result.text();
    expect(responseBody).toBe('Processed error message');

    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockProcessError).toHaveBeenCalledWith(mockError);
  });

  it('should handle errors thrown by toApiRequest', async () => {
    const mockRequest = {} as Request;
    const mockError = new Error('API request error');

    mockToApiRequest.mockRejectedValue(mockError);
    mockProcessError.mockResolvedValue('Processed error message');

    const result = await post(mockRequest);

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(500);

    const responseBody = await result.text();
    expect(responseBody).toBe('Processed error message');

    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockProcessError).toHaveBeenCalledWith(mockError);
  });

  it('should handle errors thrown by processError', async () => {
    const mockRequest = {} as Request;
    const mockError = new Error('Initial error');
    const processErrorFailure = new Error('Process error failed');

    mockToApiRequest.mockRejectedValue(mockError);
    mockProcessError.mockRejectedValue(processErrorFailure);

    const result = await post(mockRequest);

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(500);

    const responseBody = await result.text();
    expect(responseBody).toBe('Process error failed');

    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockProcessError).toHaveBeenCalledWith(mockError);
  });
});
