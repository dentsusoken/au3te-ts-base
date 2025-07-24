import { describe, it, expect } from 'vitest';
import { createResponseErrorFactory } from '../responseErrorFactory';
import { defaultResponseFactory } from '../responseFactory';
import { ResponseError } from '../ResponseError';

describe('responseErrorFactory', () => {
  const responseErrorFactory = createResponseErrorFactory(
    defaultResponseFactory
  );

  describe('badRequestResponseError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Invalid request parameter';

      // Act
      const error = responseErrorFactory.badRequestResponseError(errorMessage);
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

    it('should handle null message', async () => {
      // Act
      const error = responseErrorFactory.badRequestResponseError(null);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('bad_request');
      expect(error.response.status).toBe(400);
      expect(responseBody).toEqual({
        error: 'bad_request',
        error_description: 'bad_request',
      });
    });

    it('should handle undefined message', async () => {
      // Act
      const error = responseErrorFactory.badRequestResponseError(undefined);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('bad_request');
      expect(error.response.status).toBe(400);
      expect(responseBody).toEqual({
        error: 'bad_request',
        error_description: 'bad_request',
      });
    });
  });

  describe('internalServerErrorResponseError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Internal server error occurred';

      // Act
      const error =
        responseErrorFactory.internalServerErrorResponseError(errorMessage);
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

    it('should handle null message', async () => {
      // Act
      const error = responseErrorFactory.internalServerErrorResponseError(null);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('internal_server_error');
      expect(error.response.status).toBe(500);
      expect(responseBody).toEqual({
        error: 'internal_server_error',
        error_description: 'internal_server_error',
      });
    });

    it('should handle undefined message', async () => {
      // Act
      const error =
        responseErrorFactory.internalServerErrorResponseError(undefined);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('internal_server_error');
      expect(error.response.status).toBe(500);
      expect(responseBody).toEqual({
        error: 'internal_server_error',
        error_description: 'internal_server_error',
      });
    });

    it('should include custom headers when provided', async () => {
      // Arrange
      const errorMessage = 'Internal server error occurred';
      const headers = { 'X-Custom-Header': 'test' };

      // Act
      const error = responseErrorFactory.internalServerErrorResponseError(
        errorMessage,
        headers
      );

      // Assert
      expect(error.response.headers.get('X-Custom-Header')).toBe('test');
    });
  });

  describe('notFoundResponseError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Resource not found';

      // Act
      const error = responseErrorFactory.notFoundResponseError(errorMessage);
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

    it('should handle null message', async () => {
      // Act
      const error = responseErrorFactory.notFoundResponseError(null);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('not_found');
      expect(error.response.status).toBe(404);
      expect(responseBody).toEqual({
        error: 'not_found',
        error_description: 'not_found',
      });
    });

    it('should handle undefined message', async () => {
      // Act
      const error = responseErrorFactory.notFoundResponseError(undefined);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('not_found');
      expect(error.response.status).toBe(404);
      expect(responseBody).toEqual({
        error: 'not_found',
        error_description: 'not_found',
      });
    });

    it('should include custom headers when provided', async () => {
      // Arrange
      const errorMessage = 'Resource not found';
      const headers = { 'X-Custom-Header': 'test' };

      // Act
      const error = responseErrorFactory.notFoundResponseError(
        errorMessage,
        headers
      );

      // Assert
      expect(error.response.headers.get('X-Custom-Header')).toBe('test');
    });
  });

  describe('unauthorizedResponseError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Authentication required';

      // Act
      const error =
        responseErrorFactory.unauthorizedResponseError(errorMessage);
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

    it('should handle null message', async () => {
      // Act
      const error = responseErrorFactory.unauthorizedResponseError(null);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('unauthorized');
      expect(error.response.status).toBe(401);
      expect(responseBody).toEqual({
        error: 'unauthorized',
        error_description: 'unauthorized',
      });
    });

    it('should handle undefined message', async () => {
      // Act
      const error = responseErrorFactory.unauthorizedResponseError(undefined);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('unauthorized');
      expect(error.response.status).toBe(401);
      expect(responseBody).toEqual({
        error: 'unauthorized',
        error_description: 'unauthorized',
      });
    });

    it('should include WWW-Authenticate header when challenge is provided', async () => {
      // Arrange
      const errorMessage = 'Authentication required';
      const challenge = 'Bearer realm="example"';

      // Act
      const error = responseErrorFactory.unauthorizedResponseError(
        errorMessage,
        challenge
      );
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
      const error = responseErrorFactory.unauthorizedResponseError(
        errorMessage,
        challenge,
        headers
      );

      // Assert
      expect(error.response.headers.get('X-Custom-Header')).toBe('test');
    });
  });

  describe('forbiddenResponseError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Access denied';

      // Act
      const error = responseErrorFactory.forbiddenResponseError(errorMessage);
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

    it('should handle null message', async () => {
      // Act
      const error = responseErrorFactory.forbiddenResponseError(null);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('forbidden');
      expect(error.response.status).toBe(403);
      expect(responseBody).toEqual({
        error: 'forbidden',
        error_description: 'forbidden',
      });
    });

    it('should handle undefined message', async () => {
      // Act
      const error = responseErrorFactory.forbiddenResponseError(undefined);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('forbidden');
      expect(error.response.status).toBe(403);
      expect(responseBody).toEqual({
        error: 'forbidden',
        error_description: 'forbidden',
      });
    });

    it('should include custom headers when provided', async () => {
      // Arrange
      const errorMessage = 'Access denied';
      const headers = { 'X-Custom-Header': 'test' };

      // Act
      const error = responseErrorFactory.forbiddenResponseError(
        errorMessage,
        headers
      );

      // Assert
      expect(error.response.headers.get('X-Custom-Header')).toBe('test');
    });
  });

  describe('tooLargeResponseError', () => {
    it('should return a ResponseError instance with the error message', async () => {
      // Arrange
      const errorMessage = 'Request entity too large';

      // Act
      const error = responseErrorFactory.tooLargeResponseError(errorMessage);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe(errorMessage);
      expect(error.response.status).toBe(413);
      expect(responseBody).toEqual({
        error: 'payload_too_large',
        error_description: errorMessage,
      });
    });

    it('should handle null message', async () => {
      // Act
      const error = responseErrorFactory.tooLargeResponseError(null);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('payload_too_large');
      expect(error.response.status).toBe(413);
      expect(responseBody).toEqual({
        error: 'payload_too_large',
        error_description: 'payload_too_large',
      });
    });

    it('should handle undefined message', async () => {
      // Act
      const error = responseErrorFactory.tooLargeResponseError(undefined);
      const responseBody = await error.response.json();

      // Assert
      expect(error).toBeInstanceOf(ResponseError);
      expect(error.message).toBe('payload_too_large');
      expect(error.response.status).toBe(413);
      expect(responseBody).toEqual({
        error: 'payload_too_large',
        error_description: 'payload_too_large',
      });
    });

    it('should include custom headers when provided', async () => {
      // Arrange
      const errorMessage = 'Request entity too large';
      const headers = { 'X-Custom-Header': 'test' };

      // Act
      const error = responseErrorFactory.tooLargeResponseError(
        errorMessage,
        headers
      );

      // Assert
      expect(error.response.headers.get('X-Custom-Header')).toBe('test');
    });
  });
});
