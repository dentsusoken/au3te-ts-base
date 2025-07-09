import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBuildAuthorizationFailError } from '../buildAuthorizationFailError';
import { ResponseError } from '../../ResponseError';

describe('createBuildAuthorizationFailError', () => {
  const mockHandle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a ResponseError with correct message and response', async () => {
    // Arrange
    const mockResponse = new Response();
    mockHandle.mockResolvedValue(mockResponse);
    const buildAuthorizationFailError =
      createBuildAuthorizationFailError(mockHandle);

    // Act
    const result = await buildAuthorizationFailError('test-ticket', 'DENIED');

    // Assert
    expect(mockHandle).toHaveBeenCalledWith({
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
