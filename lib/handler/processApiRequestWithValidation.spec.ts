import { describe, it, expect, vi } from 'vitest';
import { createProcessApiRequestWithValidation } from './processApiRequestWithValidation';

describe('processApiRequestWithValidation', () => {
  // Define test types
  type TestRequest = { param: string };
  type TestResponse = { result: number };
  type TestOptions = { additionalOption: string };

  describe('createProcessApiRequestWithValidation', () => {
    it('should process request and validate response successfully', async () => {
      // Arrange
      const mockRequest: TestRequest = { param: 'test' };
      const mockResponse: TestResponse = { result: 42 };

      const processApiRequest = vi.fn().mockResolvedValue(mockResponse);
      const validateApiResponse = vi.fn().mockResolvedValue(undefined);

      const processWithValidation = createProcessApiRequestWithValidation({
        processApiRequest,
        validateApiResponse,
      });

      // Act
      const result = await processWithValidation(mockRequest);

      // Assert
      expect(processApiRequest).toHaveBeenCalledWith(mockRequest);
      expect(validateApiResponse).toHaveBeenCalledWith(mockResponse, undefined);
      expect(result).toBe(mockResponse);
    });

    it('should pass options to validateApiResponse when provided', async () => {
      // Arrange
      const mockRequest: TestRequest = { param: 'test' };
      const mockResponse: TestResponse = { result: 42 };
      const mockOptions: TestOptions = { additionalOption: 'option1' };

      const processApiRequest = vi.fn().mockResolvedValue(mockResponse);
      const validateApiResponse = vi.fn().mockResolvedValue(undefined);

      const processWithValidation = createProcessApiRequestWithValidation<
        TestRequest,
        TestResponse,
        TestOptions
      >({
        processApiRequest,
        validateApiResponse,
      });

      // Act
      const result = await processWithValidation(mockRequest, mockOptions);

      // Assert
      expect(processApiRequest).toHaveBeenCalledWith(mockRequest);
      expect(validateApiResponse).toHaveBeenCalledWith(
        mockResponse,
        mockOptions
      );
      expect(result).toBe(mockResponse);
    });
  });
});
