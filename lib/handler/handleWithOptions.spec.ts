import { describe, it, expect, vi } from 'vitest';
import { createHandleWithOptions } from './handleWithOptions';
import { Result } from 'oid4vc-core/utils';

describe('createHandleWithOptions', () => {
  // Mock functions
  const mockProcessApiRequest = vi.fn();
  const mockProcessApiResponse = vi.fn();
  const mockRecoverResponseResult = vi.fn();

  // Test path
  const testPath = '/test/path';

  // Test setup
  const setup = () => {
    return createHandleWithOptions({
      path: testPath,
      processApiRequest: mockProcessApiRequest,
      processApiResponse: mockProcessApiResponse,
      recoverResponseResult: mockRecoverResponseResult,
    });
  };

  it('should successfully process request and return response', async () => {
    // Arrange
    const handleWithOptions = setup();
    const mockApiRequest = { data: 'test' };
    const mockOptions = { option: 'value' };
    const mockApiResponse = { result: 'success' };
    const mockProcessedResponse = new Response('success', { status: 200 });

    mockProcessApiRequest.mockResolvedValue(mockApiResponse);
    mockProcessApiResponse.mockResolvedValue(mockProcessedResponse);
    mockRecoverResponseResult.mockImplementation(
      async (_, result: Result<Response>) => result.value!
    );

    // Act
    const result = await handleWithOptions({
      apiRequest: mockApiRequest,
      options: mockOptions,
    });

    // Assert
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).toHaveBeenCalledWith({
      apiResponse: mockApiResponse,
      options: mockOptions,
    });
    expect(mockRecoverResponseResult).toHaveBeenCalledWith(
      testPath,
      expect.any(Result)
    );
    expect(result).toBe(mockProcessedResponse);
  });

  it('should handle API request processing error', async () => {
    // Arrange
    const handleWithOptions = setup();
    const mockApiRequest = { data: 'test' };
    const mockOptions = { option: 'value' };
    const mockError = new Error('API request failed');
    const mockErrorResponse = new Response('error', { status: 500 });

    mockProcessApiRequest.mockRejectedValueOnce(mockError);
    mockProcessApiResponse.mockClear();
    mockRecoverResponseResult.mockImplementation(
      async (_, result: Result<Response>) => {
        if (result.isFailure()) {
          return mockErrorResponse;
        }
        return result.value!;
      }
    );

    // Act
    const result = await handleWithOptions({
      apiRequest: mockApiRequest,
      options: mockOptions,
    });

    // Assert
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).not.toHaveBeenCalled();
    expect(mockRecoverResponseResult).toHaveBeenCalledWith(
      testPath,
      expect.any(Result)
    );
    expect(result).toBe(mockErrorResponse);
  });

  it('should handle API response processing error', async () => {
    // Arrange
    const handleWithOptions = setup();
    const mockApiRequest = { data: 'test' };
    const mockOptions = { option: 'value' };
    const mockApiResponse = { result: 'success' };
    const mockError = new Error('API response processing failed');
    const mockErrorResponse = new Response('error', { status: 500 });

    mockProcessApiRequest.mockResolvedValue(mockApiResponse);
    mockProcessApiResponse.mockRejectedValue(mockError);
    mockRecoverResponseResult.mockImplementation(
      async (_, result: Result<Response>) => {
        if (result.isFailure()) {
          return mockErrorResponse;
        }
        return result.value!;
      }
    );

    // Act
    const result = await handleWithOptions({
      apiRequest: mockApiRequest,
      options: mockOptions,
    });

    // Assert
    expect(mockProcessApiRequest).toHaveBeenCalledWith(mockApiRequest);
    expect(mockProcessApiResponse).toHaveBeenCalledWith({
      apiResponse: mockApiResponse,
      options: mockOptions,
    });
    expect(mockRecoverResponseResult).toHaveBeenCalledWith(
      testPath,
      expect.any(Result)
    );
    expect(result).toBe(mockErrorResponse);
  });

  it('should pass the correct path to recoverResponseResult', async () => {
    // Arrange
    const handleWithOptions = setup();
    const mockApiRequest = { data: 'test' };
    const mockOptions = { option: 'value' };
    const mockApiResponse = { result: 'success' };
    const mockProcessedResponse = new Response('success', { status: 200 });

    mockProcessApiRequest.mockResolvedValue(mockApiResponse);
    mockProcessApiResponse.mockResolvedValue(mockProcessedResponse);
    mockRecoverResponseResult.mockImplementation(
      async (path, result: Result<Response>) => {
        expect(path).toBe(testPath);
        return result.value!;
      }
    );

    // Act
    await handleWithOptions({
      apiRequest: mockApiRequest,
      options: mockOptions,
    });

    // Assert
    expect(mockRecoverResponseResult).toHaveBeenCalledWith(
      testPath,
      expect.any(Result)
    );
  });
});
