import { describe, it, expect, vi } from 'vitest';
import { createValidateApiResponse } from './validateApiResponse';
import {
  internalServerErrorResponseError,
  badRequestResponseError,
  unauthorizedResponseError,
  forbiddenResponseError,
} from '../responseErrorFactory';
import { IntrospectionResponse } from 'au3te-ts-common/schemas.introspection';

// Configure mock functions to throw errors
const mockError = new Error('Test error');
vi.mock('../responseErrorFactory', () => ({
  internalServerErrorResponseError: vi.fn().mockImplementation(() => {
    throw mockError;
  }),
  badRequestResponseError: vi.fn().mockImplementation(() => {
    throw mockError;
  }),
  unauthorizedResponseError: vi.fn().mockImplementation(() => {
    throw mockError;
  }),
  forbiddenResponseError: vi.fn().mockImplementation(() => {
    throw mockError;
  }),
}));

describe('validateApiResponse for introspection', () => {
  const mockPath = '/api/introspection';
  const mockBuildUnknownActionMessage = vi.fn(
    (path, action) => `Unknown action '${action}' for ${path}`
  );
  const mockPrepareHeaders = vi.fn(({ dpopNonce }) => ({
    ...(dpopNonce ? { 'DPoP-Nonce': dpopNonce } : {}),
  }));

  const validateApiResponse = createValidateApiResponse({
    path: mockPath,
    buildUnknownActionMessage: mockBuildUnknownActionMessage,
    prepareHeaders: mockPrepareHeaders,
  });

  it('should handle OK action without throwing error', async () => {
    const response = {
      action: 'OK',
      responseContent: 'success',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;

    await expect(validateApiResponse(response)).resolves.toBeUndefined();
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: 'nonce123' });
  });

  it('should throw BadRequestError for BAD_REQUEST action', async () => {
    const response = {
      action: 'BAD_REQUEST',
      responseContent: 'bad request message',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;
    const headers = { 'DPoP-Nonce': 'nonce123' };

    await expect(validateApiResponse(response)).rejects.toThrow(mockError);
    expect(badRequestResponseError).toHaveBeenCalledWith(
      response.responseContent,
      headers
    );
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: 'nonce123' });
  });

  it('should throw UnauthorizedError for UNAUTHORIZED action', async () => {
    const response = {
      action: 'UNAUTHORIZED',
      responseContent: 'unauthorized message',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;
    const headers = { 'DPoP-Nonce': 'nonce123' };

    await expect(validateApiResponse(response)).rejects.toThrow(mockError);
    expect(unauthorizedResponseError).toHaveBeenCalledWith(
      response.responseContent,
      undefined,
      headers
    );
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: 'nonce123' });
  });

  it('should throw ForbiddenError for FORBIDDEN action', async () => {
    const response = {
      action: 'FORBIDDEN',
      responseContent: 'forbidden message',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;
    const headers = { 'DPoP-Nonce': 'nonce123' };

    await expect(validateApiResponse(response)).rejects.toThrow(mockError);
    expect(forbiddenResponseError).toHaveBeenCalledWith(
      response.responseContent,
      headers
    );
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: 'nonce123' });
  });

  it('should throw InternalServerError for INTERNAL_SERVER_ERROR action', async () => {
    const response = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: 'internal server error message',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;
    const headers = { 'DPoP-Nonce': 'nonce123' };

    await expect(validateApiResponse(response)).rejects.toThrow(mockError);
    expect(internalServerErrorResponseError).toHaveBeenCalledWith(
      response.responseContent,
      headers
    );
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: 'nonce123' });
  });

  it('should throw InternalServerError for unknown action', async () => {
    const response = {
      action: 'UNKNOWN_ACTION',
      responseContent: 'some message',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;

    await expect(validateApiResponse(response)).rejects.toThrow(mockError);
    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      mockPath,
      'UNKNOWN_ACTION'
    );
    expect(internalServerErrorResponseError).toHaveBeenCalledWith(
      `Unknown action 'UNKNOWN_ACTION' for /api/introspection`
    );
  });

  it('should handle undefined dpopNonce correctly', async () => {
    const response = {
      action: 'OK',
      responseContent: 'success',
    } as unknown as IntrospectionResponse;

    await expect(validateApiResponse(response)).resolves.toBeUndefined();
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: undefined });
  });
});
