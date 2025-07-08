import { describe, it, expect, vi } from 'vitest';
import { createHandleTokenCreate } from './handleTokenCreate';
import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';
import { TokenCreateRequest } from '@vecrea/au3te-ts-common/schemas.token-create';
import { Headers } from '../../utils/responseFactory';

describe('createHandleTokenCreate', () => {
  it('should call dependencies with correct arguments and return response', async () => {
    // Setup mocks
    const mockResponse = new Response('success', { status: 200 });
    const mockTokenResponse = {
      action: 'PASSWORD',
      resultCode: 'A000',
    } as TokenResponse;
    const mockTokenCreateRequest = {
      grantType: 'client_credentials',
    } as TokenCreateRequest;
    const mockHeaders = {
      'Content-Type': 'application/json',
    } as Headers;

    // Mock dependencies
    const responseToCreateRequest = vi
      .fn()
      .mockResolvedValue(mockTokenCreateRequest);
    const handle4TokenCreate = vi.fn().mockResolvedValue(mockResponse);

    // Create and execute handler
    const handleTokenCreate = createHandleTokenCreate({
      responseToCreateRequest,
      handle4TokenCreate,
    });
    const result = await handleTokenCreate(mockTokenResponse, mockHeaders);

    // Verify
    expect(responseToCreateRequest).toHaveBeenCalledWith(mockTokenResponse);
    expect(handle4TokenCreate).toHaveBeenCalledWith(
      mockTokenCreateRequest,
      mockHeaders
    );
    expect(result).toBe(mockResponse);
  });
});
