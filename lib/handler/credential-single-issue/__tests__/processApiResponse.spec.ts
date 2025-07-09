import { describe, it, expect, vi } from 'vitest';
import { createProcessApiResponse } from '../processApiResponse';
import * as responseFactory from '../../../utils/responseFactory';
import { CredentialSingleIssueResponse } from '@vecrea/au3te-ts-common/schemas.credential-single-issue';
import { ApiResponseWithOptions } from '../../types';
import { CredentialApiOptions } from '../../credential/types';

describe('createProcessApiResponse', () => {
  // Mock functions
  const mockBuildUnknownActionMessage = vi.fn();

  // Mock responseFactory methods
  vi.mock('../../../utils/responseFactory', () => ({
    internalServerError: vi.fn(),
    badRequest: vi.fn(),
    unauthorized: vi.fn(),
    forbidden: vi.fn(),
    ok: vi.fn(),
    okJwt: vi.fn(),
    accepted: vi.fn(),
    acceptedJwt: vi.fn(),
  }));

  // Test path
  const testPath = '/test/path';

  // Common test data
  const mockHeaders = { 'Custom-Header': 'value' };
  const mockAccessToken = 'test_token';
  const mockResponseContent = '{"test":"data"}';
  const mockOptions: CredentialApiOptions = {
    headers: mockHeaders,
    accessToken: mockAccessToken,
  };

  // Test setup
  const setup = () => {
    return createProcessApiResponse({
      path: testPath,
      buildUnknownActionMessage: mockBuildUnknownActionMessage,
    });
  };

  it('should handle CALLER_ERROR action', async () => {
    // Arrange
    const processApiResponse = setup();
    const mockResponse = new Response('error', { status: 500 });
    const apiResponseWithOptions: ApiResponseWithOptions<
      CredentialSingleIssueResponse,
      CredentialApiOptions
    > = {
      apiResponse: {
        action: 'CALLER_ERROR',
        responseContent: mockResponseContent,
      },
      options: mockOptions,
    };
    vi.mocked(responseFactory.internalServerError).mockReturnValue(
      mockResponse
    );

    // Act
    const result = await processApiResponse(apiResponseWithOptions);

    // Assert
    expect(responseFactory.internalServerError).toHaveBeenCalledWith(
      mockResponseContent,
      mockHeaders
    );
    expect(result).toBe(mockResponse);
  });

  it('should handle BAD_REQUEST action', async () => {
    // Arrange
    const processApiResponse = setup();
    const mockResponse = new Response('error', { status: 400 });
    const apiResponseWithOptions: ApiResponseWithOptions<
      CredentialSingleIssueResponse,
      CredentialApiOptions
    > = {
      apiResponse: {
        action: 'BAD_REQUEST',
        responseContent: mockResponseContent,
      },
      options: mockOptions,
    };
    vi.mocked(responseFactory.badRequest).mockReturnValue(mockResponse);

    // Act
    const result = await processApiResponse(apiResponseWithOptions);

    // Assert
    expect(responseFactory.badRequest).toHaveBeenCalledWith(
      mockResponseContent,
      mockHeaders
    );
    expect(result).toBe(mockResponse);
  });

  it('should handle UNAUTHORIZED action', async () => {
    // Arrange
    const processApiResponse = setup();
    const mockResponse = new Response('error', { status: 401 });
    const apiResponseWithOptions: ApiResponseWithOptions<
      CredentialSingleIssueResponse,
      CredentialApiOptions
    > = {
      apiResponse: {
        action: 'UNAUTHORIZED',
        responseContent: mockResponseContent,
      },
      options: mockOptions,
    };
    vi.mocked(responseFactory.unauthorized).mockReturnValue(mockResponse);

    // Act
    const result = await processApiResponse(apiResponseWithOptions);

    // Assert
    expect(responseFactory.unauthorized).toHaveBeenCalledWith(
      mockAccessToken,
      mockResponseContent,
      mockHeaders
    );
    expect(result).toBe(mockResponse);
  });

  it('should handle OK action', async () => {
    // Arrange
    const processApiResponse = setup();
    const mockResponse = new Response('success', { status: 200 });
    const apiResponseWithOptions: ApiResponseWithOptions<
      CredentialSingleIssueResponse,
      CredentialApiOptions
    > = {
      apiResponse: {
        action: 'OK',
        responseContent: mockResponseContent,
      },
      options: mockOptions,
    };
    vi.mocked(responseFactory.ok).mockReturnValue(mockResponse);

    // Act
    const result = await processApiResponse(apiResponseWithOptions);

    // Assert
    expect(responseFactory.ok).toHaveBeenCalledWith(
      mockResponseContent,
      mockHeaders
    );
    expect(result).toBe(mockResponse);
  });

  it('should handle OK_JWT action', async () => {
    // Arrange
    const processApiResponse = setup();
    const mockResponse = new Response('jwt', { status: 200 });
    const apiResponseWithOptions: ApiResponseWithOptions<
      CredentialSingleIssueResponse,
      CredentialApiOptions
    > = {
      apiResponse: {
        action: 'OK_JWT',
        responseContent: mockResponseContent,
      },
      options: mockOptions,
    };
    vi.mocked(responseFactory.okJwt).mockReturnValue(mockResponse);

    // Act
    const result = await processApiResponse(apiResponseWithOptions);

    // Assert
    expect(responseFactory.okJwt).toHaveBeenCalledWith(
      mockResponseContent,
      mockHeaders
    );
    expect(result).toBe(mockResponse);
  });

  it('should handle unknown action', async () => {
    // Arrange
    const processApiResponse = setup();
    const mockResponse = new Response('error', { status: 500 });
    const unknownAction = 'UNKNOWN_ACTION';
    const mockErrorMessage = 'Unknown action error';
    const apiResponseWithOptions: ApiResponseWithOptions<
      CredentialSingleIssueResponse,
      CredentialApiOptions
    > = {
      apiResponse: {
        action: unknownAction as any,
        responseContent: mockResponseContent,
      },
      options: mockOptions,
    };
    mockBuildUnknownActionMessage.mockReturnValue(mockErrorMessage);
    vi.mocked(responseFactory.internalServerError).mockReturnValue(
      mockResponse
    );

    // Act
    const result = await processApiResponse(apiResponseWithOptions);

    // Assert
    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      testPath,
      unknownAction
    );
    expect(responseFactory.internalServerError).toHaveBeenCalledWith(
      mockErrorMessage,
      mockHeaders
    );
    expect(result).toBe(mockResponse);
  });

  it('should handle null responseContent for UNAUTHORIZED action', async () => {
    // Arrange
    const processApiResponse = setup();
    const mockResponse = new Response('error', { status: 401 });
    const apiResponseWithOptions: ApiResponseWithOptions<
      CredentialSingleIssueResponse,
      CredentialApiOptions
    > = {
      apiResponse: {
        action: 'UNAUTHORIZED',
        responseContent: null,
      },
      options: mockOptions,
    };
    vi.mocked(responseFactory.unauthorized).mockReturnValue(mockResponse);

    // Act
    const result = await processApiResponse(apiResponseWithOptions);

    // Assert
    expect(responseFactory.unauthorized).toHaveBeenCalledWith(
      mockAccessToken,
      undefined,
      mockHeaders
    );
    expect(result).toBe(mockResponse);
  });
});
