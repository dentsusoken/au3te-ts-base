import { describe, it, expect } from 'vitest';
import { badRequestError } from './responseErrorFactory';
import { ResponseError } from './ResponseError';

describe('responseErrorFactory', () => {
  describe('badRequestError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Invalid request parameter';

      // Act
      const error = badRequestError(errorMessage);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe(errorMessage);
      expect(error.response.status).toBe(400);
      expect(responseBody).toEqual({
        error: 'invalid_request',
        error_description: errorMessage,
      });
    });
  });
});
