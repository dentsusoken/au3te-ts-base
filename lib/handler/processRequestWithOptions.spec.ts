import { describe, it, expect, vi } from 'vitest';
import { createProcessRequestWithOptions } from './processRequestWithOptions';
import { Result } from '@vecrea/oid4vc-core/utils';

describe('createProcessRequestWithOptions', () => {
  // Mock functions
  const mockToApiRequest = vi.fn();
  const mockHandle = vi.fn();
  const mockRecoverResponseResult = vi.fn();

  // Test path
  const testPath = '/test/path';

  // Test setup
  const setup = () => {
    return createProcessRequestWithOptions({
      path: testPath,
      toApiRequest: mockToApiRequest,
      handle: mockHandle,
      recoverResponseResult: mockRecoverResponseResult,
    });
  };

  it('should successfully process request and return response', async () => {
    // Arrange
    const processRequest = setup();
    const mockRequest = new Request('https://example.com');
    const mockApiRequestWithOptions = {
      apiRequest: { data: 'test' },
      options: { option: 'value' },
    };
    const mockResponse = new Response('success', { status: 200 });

    mockToApiRequest.mockResolvedValue(mockApiRequestWithOptions);
    mockHandle.mockResolvedValue(mockResponse);
    mockRecoverResponseResult.mockImplementation(
      async (_, result: Result<Response>) => result.value!
    );

    // Act
    const result = await processRequest(mockRequest);

    // Assert
    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockHandle).toHaveBeenCalledWith(mockApiRequestWithOptions);
    expect(mockRecoverResponseResult).toHaveBeenCalledWith(
      testPath,
      expect.any(Result)
    );
    expect(result).toBe(mockResponse);
  });

  it('should handle toApiRequest error', async () => {
    // Arrange
    const processRequest = setup();
    const mockRequest = new Request('https://example.com');
    const mockError = new Error('API request conversion failed');
    const mockErrorResponse = new Response('error', { status: 500 });

    mockToApiRequest.mockRejectedValueOnce(mockError);
    mockHandle.mockClear();
    mockRecoverResponseResult.mockImplementation(
      async (_, result: Result<Response>) => {
        if (result.isFailure()) {
          return mockErrorResponse;
        }
        return result.value!;
      }
    );

    // Act
    const result = await processRequest(mockRequest);

    // Assert
    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockHandle).not.toHaveBeenCalled();
    expect(mockRecoverResponseResult).toHaveBeenCalledWith(
      testPath,
      expect.any(Result)
    );
    expect(result).toBe(mockErrorResponse);
  });

  it('should handle processing error', async () => {
    // Arrange
    const processRequest = setup();
    const mockRequest = new Request('https://example.com');
    const mockApiRequestWithOptions = {
      apiRequest: { data: 'test' },
      options: { option: 'value' },
    };
    const mockError = new Error('Processing failed');
    const mockErrorResponse = new Response('error', { status: 500 });

    mockToApiRequest.mockResolvedValue(mockApiRequestWithOptions);
    mockHandle.mockRejectedValueOnce(mockError);
    mockRecoverResponseResult.mockImplementation(
      async (_, result: Result<Response>) => {
        if (result.isFailure()) {
          return mockErrorResponse;
        }
        return result.value!;
      }
    );

    // Act
    const result = await processRequest(mockRequest);

    // Assert
    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockHandle).toHaveBeenCalledWith(mockApiRequestWithOptions);
    expect(mockRecoverResponseResult).toHaveBeenCalledWith(
      testPath,
      expect.any(Result)
    );
    expect(result).toBe(mockErrorResponse);
  });

  it('should pass the correct path to recoverResponseResult', async () => {
    // Arrange
    const processRequest = setup();
    const mockRequest = new Request('https://example.com');
    const mockApiRequestWithOptions = {
      apiRequest: { data: 'test' },
      options: { option: 'value' },
    };
    const mockResponse = new Response('success', { status: 200 });

    mockToApiRequest.mockResolvedValue(mockApiRequestWithOptions);
    mockHandle.mockResolvedValue(mockResponse);
    mockRecoverResponseResult.mockImplementation(
      async (path, result: Result<Response>) => {
        expect(path).toBe(testPath);
        return result.value!;
      }
    );

    // Act
    await processRequest(mockRequest);

    // Assert
    expect(mockRecoverResponseResult).toHaveBeenCalledWith(
      testPath,
      expect.any(Result)
    );
  });
});
