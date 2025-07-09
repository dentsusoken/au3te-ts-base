import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProcessApiResponse } from '../processApiResponse';
import * as responseFactory from '../../../utils/responseFactory';
import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';

// Mock responseFactory methods
vi.mock('../../../utils/responseFactory', () => ({
  ok: vi.fn(),
  badRequest: vi.fn(),
  unauthorized: vi.fn(),
  internalServerError: vi.fn(),
}));

describe('createProcessApiResponse', () => {
  // Mock dependencies
  const mockPrepareHeaders = vi
    .fn()
    .mockReturnValue({ 'Content-Type': 'application/json' });
  const mockHandlePassword = vi.fn();
  const mockHandleTokenExchange = vi.fn();
  const mockHandleJwtBearer = vi.fn();
  const mockBuildUnknownActionMessage = vi.fn(
    (_path, action) => `Unknown action: ${action}`
  );

  const processApiResponse = createProcessApiResponse({
    path: '/token',
    prepareHeaders: mockPrepareHeaders,
    handlePassword: mockHandlePassword,
    handleTokenExchange: mockHandleTokenExchange,
    handleJwtBearer: mockHandleJwtBearer,
    buildUnknownActionMessage: mockBuildUnknownActionMessage,
  });

  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test successful token response
  it('should handle OK action', async () => {
    const mockResponse: TokenResponse = {
      action: 'OK',
      responseContent: '{"access_token": "test-token"}',
      dpopNonce: 'test-nonce',
    };

    await processApiResponse(mockResponse);

    expect(mockPrepareHeaders).toHaveBeenCalledWith({
      dpopNonce: 'test-nonce',
    });
    expect(responseFactory.ok).toHaveBeenCalledWith(
      mockResponse.responseContent,
      { 'Content-Type': 'application/json' }
    );
  });

  // Test ID token reissuable response
  it('should handle ID_TOKEN_REISSUABLE action', async () => {
    const mockResponse: TokenResponse = {
      action: 'ID_TOKEN_REISSUABLE',
      responseContent: '{"id_token": "test-id-token"}',
      dpopNonce: 'test-nonce',
    };

    await processApiResponse(mockResponse);

    expect(responseFactory.ok).toHaveBeenCalledWith(
      mockResponse.responseContent,
      { 'Content-Type': 'application/json' }
    );
  });

  // Test bad request response
  it('should handle BAD_REQUEST action', async () => {
    const mockResponse: TokenResponse = {
      action: 'BAD_REQUEST',
      responseContent: '{"error": "invalid_request"}',
      dpopNonce: 'test-nonce',
    };

    await processApiResponse(mockResponse);

    expect(responseFactory.badRequest).toHaveBeenCalledWith(
      mockResponse.responseContent,
      { 'Content-Type': 'application/json' }
    );
  });

  // Test invalid client response
  it('should handle INVALID_CLIENT action', async () => {
    const mockResponse: TokenResponse = {
      action: 'INVALID_CLIENT',
      responseContent: '{"error": "invalid_client"}',
      dpopNonce: 'test-nonce',
    };

    await processApiResponse(mockResponse);

    expect(responseFactory.unauthorized).toHaveBeenCalledWith(
      mockResponse.responseContent,
      'Basic realm="token"',
      { 'Content-Type': 'application/json' }
    );
  });

  // Test internal server error response
  it('should handle INTERNAL_SERVER_ERROR action', async () => {
    const mockResponse: TokenResponse = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: '{"error": "server_error"}',
      dpopNonce: 'test-nonce',
    };

    await processApiResponse(mockResponse);

    expect(responseFactory.internalServerError).toHaveBeenCalledWith(
      mockResponse.responseContent,
      { 'Content-Type': 'application/json' }
    );
  });

  // Test password flow
  it('should handle PASSWORD action', async () => {
    const mockResponse: TokenResponse = {
      action: 'PASSWORD',
      responseContent: '{"access_token": "test-token"}',
      dpopNonce: 'test-nonce',
    };

    await processApiResponse(mockResponse);

    expect(mockHandlePassword).toHaveBeenCalledWith(mockResponse, {
      'Content-Type': 'application/json',
    });
  });

  // Test token exchange
  it('should handle TOKEN_EXCHANGE action', async () => {
    const mockResponse: TokenResponse = {
      action: 'TOKEN_EXCHANGE',
      responseContent: '{"access_token": "exchanged-token"}',
      dpopNonce: 'test-nonce',
    };

    await processApiResponse(mockResponse);

    expect(mockHandleTokenExchange).toHaveBeenCalledWith(mockResponse, {
      'Content-Type': 'application/json',
    });
  });

  // Test JWT bearer
  it('should handle JWT_BEARER action', async () => {
    const mockResponse: TokenResponse = {
      action: 'JWT_BEARER',
      responseContent: '{"access_token": "jwt-token"}',
      dpopNonce: 'test-nonce',
    };

    await processApiResponse(mockResponse);

    expect(mockHandleJwtBearer).toHaveBeenCalledWith(mockResponse, {
      'Content-Type': 'application/json',
    });
  });

  // Test unknown action
  it('should handle unknown action', async () => {
    const mockResponse: TokenResponse = {
      action: 'UNKNOWN_ACTION' as TokenResponse['action'],
      responseContent: '',
      dpopNonce: 'test-nonce',
    };

    await processApiResponse(mockResponse);

    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      '/token',
      'UNKNOWN_ACTION'
    );
    expect(responseFactory.internalServerError).toHaveBeenCalledWith(
      'Unknown action: UNKNOWN_ACTION'
    );
  });
});
