import { describe, it, expect } from 'vitest';
import { createValidateApiResponse } from './validateApiResponse';
import { CredentialIssuerJwksResponse } from '@vecrea/au3te-ts-common/schemas.credential-issuer-jwks';
import {
  notFoundResponseError,
  internalServerErrorResponseError,
} from '../responseErrorFactory';

describe('credential-metadata/validateApiResponse', () => {
  // Test setup
  const path = '/credential-issuer-jwks';
  const buildUnknownActionMessage = (path: string, action: string) =>
    `Unknown action: ${action} for ${path}`;

  const validateApiResponse = createValidateApiResponse({
    path,
    buildUnknownActionMessage,
  });

  describe('createValidateApiResponse', () => {
    it('should validate OK response without throwing error', async () => {
      // Arrange
      const response: CredentialIssuerJwksResponse = {
        action: 'OK',
        responseContent: 'success',
      };

      // Act & Assert
      await expect(validateApiResponse(response)).resolves.toBeUndefined();
    });

    it('should throw notFoundError for NOT_FOUND response', async () => {
      // Arrange
      const errorMessage = 'Resource not found';
      const response: CredentialIssuerJwksResponse = {
        action: 'NOT_FOUND',
        responseContent: errorMessage,
      };

      // Act & Assert
      await expect(validateApiResponse(response)).rejects.toThrow(
        notFoundResponseError(errorMessage).message
      );
    });

    it('should throw internalServerError for INTERNAL_SERVER_ERROR response', async () => {
      // Arrange
      const errorMessage = 'Internal server error occurred';
      const response: CredentialIssuerJwksResponse = {
        action: 'INTERNAL_SERVER_ERROR',
        responseContent: errorMessage,
      };

      // Act & Assert
      await expect(validateApiResponse(response)).rejects.toThrow(
        internalServerErrorResponseError(errorMessage).message
      );
    });

    it('should throw internalServerError for unknown action', async () => {
      // Arrange
      const unknownAction = 'UNKNOWN_ACTION';
      const response: CredentialIssuerJwksResponse = {
        action: unknownAction as CredentialIssuerJwksResponse['action'],
        responseContent: 'Some content',
      };

      // Act & Assert
      await expect(validateApiResponse(response)).rejects.toThrow(
        internalServerErrorResponseError(
          buildUnknownActionMessage(path, unknownAction)
        ).message
      );
    });
  });
});
