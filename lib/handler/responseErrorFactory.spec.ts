import { describe, it, expect } from 'vitest';
import {
  badRequestError,
  internalServerErrorError,
} from './responseErrorFactory';
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
        error: 'bad_request',
        error_description: errorMessage,
      });
    });
  });

  describe('internalServerErrorError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Internal server error occurred';

      // Act
      const error = internalServerErrorError(errorMessage);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe(errorMessage);
      expect(error.response.status).toBe(500);
      expect(responseBody).toEqual({
        error: 'internal_server_error',
        error_description: errorMessage,
      });
    });
  });
});
