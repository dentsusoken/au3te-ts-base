import { describe, it, expect } from 'vitest';
import {
  badRequestError,
  internalServerErrorError,
  notFoundError,
  unauthorizedError,
  forbiddenError,
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

    it('should include custom headers when provided', async () => {
      // Arrange
      const errorMessage = 'Internal server error occurred';
      const headers = { 'X-Custom-Header': 'test' };

      // Act
      const error = internalServerErrorError(errorMessage, headers);

      // Assert
      expect(error.response.headers.get('X-Custom-Header')).toBe('test');
    });
  });

  describe('notFoundError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Resource not found';

      // Act
      const error = notFoundError(errorMessage);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe(errorMessage);
      expect(error.response.status).toBe(404);
      expect(responseBody).toEqual({
        error: 'not_found',
        error_description: errorMessage,
      });
    });

    it('should include custom headers when provided', async () => {
      // Arrange
      const errorMessage = 'Resource not found';
      const headers = { 'X-Custom-Header': 'test' };

      // Act
      const error = notFoundError(errorMessage, headers);

      // Assert
      expect(error.response.headers.get('X-Custom-Header')).toBe('test');
    });
  });

  describe('unauthorizedError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Authentication required';

      // Act
      const error = unauthorizedError(errorMessage);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe(errorMessage);
      expect(error.response.status).toBe(401);
      expect(responseBody).toEqual({
        error: 'unauthorized',
        error_description: errorMessage,
      });
    });

    it('should include WWW-Authenticate header when challenge is provided', async () => {
      // Arrange
      const errorMessage = 'Authentication required';
      const challenge = 'Bearer realm="example"';

      // Act
      const error = unauthorizedError(errorMessage, challenge);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe(errorMessage);
      expect(error.response.status).toBe(401);
      expect(error.response.headers.get('WWW-Authenticate')).toBe(challenge);
      expect(responseBody).toEqual({
        error: 'unauthorized',
        error_description: errorMessage,
      });
    });

    it('should include custom headers when provided', async () => {
      // Arrange
      const errorMessage = 'Authentication required';
      const challenge = 'Bearer realm="example"';
      const headers = { 'X-Custom-Header': 'test' };

      // Act
      const error = unauthorizedError(errorMessage, challenge, headers);

      // Assert
      expect(error.response.headers.get('X-Custom-Header')).toBe('test');
    });
  });

  describe('forbiddenError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Access denied';

      // Act
      const error = forbiddenError(errorMessage);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe(errorMessage);
      expect(error.response.status).toBe(403);
      expect(responseBody).toEqual({
        error: 'forbidden',
        error_description: errorMessage,
      });
    });

    it('should include custom headers when provided', async () => {
      // Arrange
      const errorMessage = 'Access denied';
      const headers = { 'X-Custom-Header': 'test' };

      // Act
      const error = forbiddenError(errorMessage, headers);

      // Assert
      expect(error.response.headers.get('X-Custom-Header')).toBe('test');
    });
  });
});
