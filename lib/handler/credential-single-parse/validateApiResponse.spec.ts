import { describe, it, expect } from 'vitest';
import { createValidateApiResponse } from './validateApiResponse';
import { CredentialSingleParseResponse } from 'au3te-ts-common/schemas.credential-single-parse';
import {
  internalServerErrorError,
  badRequestError,
  unauthorizedError,
  forbiddenError,
} from '../responseErrorFactory';

describe('validateApiResponse for credential-single-parse', () => {
  const path = '/credential/single/parse';
  const buildUnknownActionMessage = (path: string, action: string) =>
    `Unknown action: ${action} for ${path}`;
  const headers = { 'Content-Type': 'application/json' };
  const accessToken = 'dummy-token';
  const options = { headers, accessToken };

  const validateApiResponse = createValidateApiResponse({
    path,
    buildUnknownActionMessage,
  });

  it('should throw InternalServerError when options are not provided', async () => {
    const response: CredentialSingleParseResponse = {
      action: 'OK',
      responseContent: 'test',
    };

    await expect(validateApiResponse(response)).rejects.toThrow(
      internalServerErrorError('Options are required')
    );
  });

  it('should not throw error when action is OK', async () => {
    const response: CredentialSingleParseResponse = {
      action: 'OK',
      responseContent: 'test',
    };

    await expect(
      validateApiResponse(response, options)
    ).resolves.toBeUndefined();
  });

  it('should throw BadRequestError when action is BAD_REQUEST', async () => {
    const response: CredentialSingleParseResponse = {
      action: 'BAD_REQUEST',
      responseContent: 'Invalid request',
    };

    await expect(validateApiResponse(response, options)).rejects.toThrow(
      badRequestError('Invalid request', headers)
    );
  });

  it('should throw UnauthorizedError when action is UNAUTHORIZED', async () => {
    const response: CredentialSingleParseResponse = {
      action: 'UNAUTHORIZED',
      responseContent: 'Unauthorized access',
    };

    await expect(validateApiResponse(response, options)).rejects.toThrow(
      unauthorizedError(accessToken, 'Unauthorized access', headers)
    );
  });

  it('should throw ForbiddenError when action is FORBIDDEN', async () => {
    const response: CredentialSingleParseResponse = {
      action: 'FORBIDDEN',
      responseContent: 'Access forbidden',
    };

    await expect(validateApiResponse(response, options)).rejects.toThrow(
      forbiddenError('Access forbidden', headers)
    );
  });

  it('should throw InternalServerError when action is INTERNAL_SERVER_ERROR', async () => {
    const response: CredentialSingleParseResponse = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: 'Internal server error',
    };

    await expect(validateApiResponse(response, options)).rejects.toThrow(
      internalServerErrorError('Internal server error', headers)
    );
  });

  it('should throw InternalServerError with unknown action message for unhandled action', async () => {
    const unknownAction = 'UNKNOWN_ACTION';
    const response = {
      action: unknownAction,
      responseContent: 'test',
    } as unknown as CredentialSingleParseResponse;

    await expect(validateApiResponse(response, options)).rejects.toThrow(
      internalServerErrorError(
        buildUnknownActionMessage(path, unknownAction),
        headers
      )
    );
  });
});
