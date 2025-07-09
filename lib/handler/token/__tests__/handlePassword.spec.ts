import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHandlePassword } from '../handlePassword';
import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';
import { ResponseError } from '../../ResponseError';
import type { Headers } from '../../../utils/responseFactory';

describe('createHandlePassword', () => {
  const mockGetByCredentials = vi.fn();
  const mockHandle4TokenIssue = vi.fn();
  const mockBuildTokenFailError = vi.fn();
  const mockHeaders: Headers = {};

  const handlePassword = createHandlePassword({
    getByCredentials: mockGetByCredentials,
    handle4TokenIssue: mockHandle4TokenIssue,
    buildTokenFailError: mockBuildTokenFailError,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when username is missing', async () => {
    // Arrange
    const response: TokenResponse = {
      password: 'test-password',
      ticket: 'test-ticket',
    } as TokenResponse;

    // Act & Assert
    await expect(handlePassword(response, mockHeaders)).rejects.toThrow(
      'Username and password are required'
    );
  });

  it('should throw error when password is missing', async () => {
    // Arrange
    const response: TokenResponse = {
      username: 'test-user',
      ticket: 'test-ticket',
    } as TokenResponse;

    // Act & Assert
    await expect(handlePassword(response, mockHeaders)).rejects.toThrow(
      'Username and password are required'
    );
  });

  it('should throw error when ticket is missing', async () => {
    // Arrange
    const response: TokenResponse = {
      username: 'test-user',
      password: 'test-password',
    } as TokenResponse;

    // Act & Assert
    await expect(handlePassword(response, mockHeaders)).rejects.toThrow(
      'Ticket is required'
    );
  });

  it('should handle valid credentials and issue token', async () => {
    // Arrange
    const response: TokenResponse = {
      username: 'test-user',
      password: 'test-password',
      ticket: 'test-ticket',
    } as TokenResponse;

    const mockUser = { subject: 'test-subject' };
    const expectedResponse = new Response();

    mockGetByCredentials.mockResolvedValue(mockUser);
    mockHandle4TokenIssue.mockResolvedValue(expectedResponse);

    // Act
    const result = await handlePassword(response, mockHeaders);

    // Assert
    expect(mockGetByCredentials).toHaveBeenCalledWith(
      'test-user',
      'test-password'
    );
    expect(mockHandle4TokenIssue).toHaveBeenCalledWith(
      {
        ticket: 'test-ticket',
        subject: 'test-subject',
      },
      mockHeaders
    );
    expect(result).toBe(expectedResponse);
  });

  it('should throw ResponseError for invalid credentials', async () => {
    // Arrange
    const response: TokenResponse = {
      username: 'test-user',
      password: 'wrong-password',
      ticket: 'test-ticket',
    } as TokenResponse;

    const mockError = new ResponseError('Invalid credentials', new Response());

    mockGetByCredentials.mockResolvedValue(undefined);
    mockBuildTokenFailError.mockReturnValue(mockError);

    // Act & Assert
    await expect(handlePassword(response, mockHeaders)).rejects.toThrow(
      mockError
    );
    expect(mockBuildTokenFailError).toHaveBeenCalledWith(
      'test-ticket',
      'INVALID_RESOURCE_OWNER_CREDENTIALS',
      mockHeaders
    );
  });
});
