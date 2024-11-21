import { describe, it, expect, vi } from 'vitest';
import { createProcessApiRequestWithValidation } from './processApiRequestWithValidation';

describe('processApiRequestWithValidation', () => {
  // Define test types
  type TestRequest = { param: string };
  type TestResponse = { result: number };

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
      expect(validateApiResponse).toHaveBeenCalledWith(mockResponse);
      expect(result).toBe(mockResponse);
    });
  });
});
