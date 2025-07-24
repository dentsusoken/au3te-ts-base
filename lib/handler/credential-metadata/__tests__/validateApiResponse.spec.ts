import { describe, it, expect } from 'vitest';
import { createValidateApiResponse } from '../validateApiResponse';
import { CredentialIssuerMetadataResponse } from '@vecrea/au3te-ts-common/schemas.credential-metadata';
import { defaultResponseFactory } from '../../core/responseFactory';
import { createResponseErrorFactory } from '../../core/responseErrorFactory';

describe('credential-metadata/validateApiResponse', () => {
  // Test setup
  const path = '/credential-metadata';
  const buildUnknownActionMessage = (path: string, action: string) =>
    `Unknown action: ${action} for ${path}`;

  const responseErrorFactory = createResponseErrorFactory(
    defaultResponseFactory
  );

  const validateApiResponse = createValidateApiResponse({
    path,
    responseErrorFactory,
    buildUnknownActionMessage,
  });

  describe('createValidateApiResponse', () => {
    it('should validate OK response without throwing error', async () => {
      // Arrange
      const response: CredentialIssuerMetadataResponse = {
        action: 'OK',
        responseContent: 'success',
      };

      // Act & Assert
      await expect(validateApiResponse(response)).resolves.toBeUndefined();
    });

    it('should throw notFoundError for NOT_FOUND response', async () => {
      // Arrange
      const errorMessage = 'Resource not found';
      const response: CredentialIssuerMetadataResponse = {
        action: 'NOT_FOUND',
        responseContent: errorMessage,
      };

      // Act & Assert
      await expect(validateApiResponse(response)).rejects.toThrow(
        responseErrorFactory.notFoundResponseError(errorMessage).message
      );
    });

    it('should throw internalServerError for INTERNAL_SERVER_ERROR response', async () => {
      // Arrange
      const errorMessage = 'Internal server error occurred';
      const response: CredentialIssuerMetadataResponse = {
        action: 'INTERNAL_SERVER_ERROR',
        responseContent: errorMessage,
      };

      // Act & Assert
      await expect(validateApiResponse(response)).rejects.toThrow(
        responseErrorFactory.internalServerErrorResponseError(errorMessage)
          .message
      );
    });

    it('should throw internalServerError for unknown action', async () => {
      // Arrange
      const unknownAction = 'UNKNOWN_ACTION';
      const response: CredentialIssuerMetadataResponse = {
        action: unknownAction as CredentialIssuerMetadataResponse['action'],
        responseContent: 'Some content',
      };

      // Act & Assert
      await expect(validateApiResponse(response)).rejects.toThrow(
        responseErrorFactory.internalServerErrorResponseError(
          buildUnknownActionMessage(path, unknownAction)
        ).message
      );
    });
  });
});
