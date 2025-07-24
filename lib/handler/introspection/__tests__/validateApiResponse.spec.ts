import { describe, it, expect, vi } from 'vitest';
import { createValidateApiResponse } from '../validateApiResponse';
import { createResponseErrorFactory } from '../../core/responseErrorFactory';
import { defaultResponseFactory } from '../../core/responseFactory';
import { IntrospectionResponse } from '@vecrea/au3te-ts-common/schemas.introspection';
import { ResponseError } from '../../core/ResponseError';

describe('validateApiResponse for introspection', () => {
  const mockPath = '/api/introspection';
  const mockBuildUnknownActionMessage = vi.fn(
    (path, action) => `Unknown action '${action}' for ${path}`
  );
  const mockPrepareHeaders = vi.fn(({ dpopNonce }) => ({
    ...(dpopNonce ? { 'DPoP-Nonce': dpopNonce } : {}),
  }));

  const responseErrorFactory = createResponseErrorFactory(
    defaultResponseFactory
  );

  const validateApiResponse = createValidateApiResponse({
    path: mockPath,
    responseErrorFactory,
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

    await expect(validateApiResponse(response)).rejects.toThrow(
      new ResponseError('bad request message', expect.any(Response))
    );
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: 'nonce123' });
  });

  it('should throw UnauthorizedError for UNAUTHORIZED action', async () => {
    const response = {
      action: 'UNAUTHORIZED',
      responseContent: 'unauthorized message',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;

    await expect(validateApiResponse(response)).rejects.toThrow(
      new ResponseError('unauthorized message', expect.any(Response))
    );
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: 'nonce123' });
  });

  it('should throw ForbiddenError for FORBIDDEN action', async () => {
    const response = {
      action: 'FORBIDDEN',
      responseContent: 'forbidden message',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;

    await expect(validateApiResponse(response)).rejects.toThrow(
      new ResponseError('forbidden message', expect.any(Response))
    );
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: 'nonce123' });
  });

  it('should throw InternalServerError for INTERNAL_SERVER_ERROR action', async () => {
    const response = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: 'internal server error message',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;

    await expect(validateApiResponse(response)).rejects.toThrow(
      new ResponseError('internal server error message', expect.any(Response))
    );
    expect(mockPrepareHeaders).toHaveBeenCalledWith({ dpopNonce: 'nonce123' });
  });

  it('should throw InternalServerError for unknown action', async () => {
    const response = {
      action: 'UNKNOWN_ACTION',
      responseContent: 'some message',
      dpopNonce: 'nonce123',
    } as unknown as IntrospectionResponse;

    await expect(validateApiResponse(response)).rejects.toThrow(
      new ResponseError(
        `Unknown action 'UNKNOWN_ACTION' for /api/introspection`,
        expect.any(Response)
      )
    );
    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      mockPath,
      'UNKNOWN_ACTION'
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
