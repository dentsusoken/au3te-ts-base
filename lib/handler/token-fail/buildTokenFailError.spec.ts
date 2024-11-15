import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBuildTokenFailError } from './buildTokenFailError';
import { ResponseError } from '../ResponseError';
import type { Headers } from '../../utils/responseFactory';

describe('createBuildTokenFailError', () => {
  const mockHandle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    'UNKNOWN',
    'INVALID_RESOURCE_OWNER_CREDENTIALS',
    'INVALID_TARGET',
  ] as const)('should create a ResponseError for reason %s', async (reason) => {
    // Arrange
    const mockResponse = new Response();
    const mockHeaders: Headers = {};
    mockHandle.mockResolvedValue(mockResponse);
    const buildTokenFailError = createBuildTokenFailError(mockHandle);

    // Act
    const result = await buildTokenFailError(
      'test-ticket',
      reason,
      mockHeaders
    );

    // Assert
    expect(mockHandle).toHaveBeenCalledWith(
      {
        ticket: 'test-ticket',
        reason,
      },
      mockHeaders
    );
    expect(result).toBeInstanceOf(ResponseError);
    expect(result.message).toBe(
      `Token request failed: ticket test-ticket, reason ${reason}`
    );
    expect(result.response).toBe(mockResponse);
  });
});
