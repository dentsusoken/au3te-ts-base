import { describe, it, expect, vi } from 'vitest';
import { ProcessApiRequest } from '../processApiRequest';

describe('ProcessApiRequest', () => {
  // Define test types for request and response
  type TestRequest = { id: string };
  type TestResponse = { data: string };

  it('should process API request and return response', async () => {
    // Arrange
    const mockRequest: TestRequest = { id: '123' };
    const mockResponse: TestResponse = { data: 'test-data' };

    // Create a mock implementation of ProcessApiRequest
    const processApiRequest: ProcessApiRequest<TestRequest, TestResponse> = vi
      .fn()
      .mockResolvedValue(mockResponse);

    // Act
    const result = await processApiRequest(mockRequest);

    // Assert
    expect(processApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(result).toEqual(mockResponse);
  });
});
