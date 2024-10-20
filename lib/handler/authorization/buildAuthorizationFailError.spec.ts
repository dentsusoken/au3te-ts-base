import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBuildAuthorizationFailError } from './buildAuthorizationFailError';
import { AuthorizationFailHandler } from '../authorization-fail/AuthorizationFailHandler';
import { ResponseError } from '../ResponseError';

describe('createBuildAuthorizationFailError', () => {
  // Mock AuthorizationFailHandler
  const mockHandler = {
    handle: vi.fn(),
  } as unknown as AuthorizationFailHandler;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a ResponseError with correct message and response', async () => {
    // Arrange
    const mockResponse = new Response();
    vi.mocked(mockHandler.handle).mockResolvedValue(mockResponse);
    const buildAuthorizationFailError =
      createBuildAuthorizationFailError(mockHandler);

    // Act
    const result = await buildAuthorizationFailError('test-ticket', 'DENIED');

    // Assert
    expect(mockHandler.handle).toHaveBeenCalledWith({
      ticket: 'test-ticket',
      reason: 'DENIED',
    });
    expect(result).toBeInstanceOf(ResponseError);
    expect(result.message).toBe(
      'Authorization failed: ticket test-ticket, reason DENIED'
    );
    expect(result.response).toBe(mockResponse);
  });
});
