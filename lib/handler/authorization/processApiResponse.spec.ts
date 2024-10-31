import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProcessApiResponse } from './processApiResponse';
import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';
import * as responseFactory from '../../utils/responseFactory';
import { Session } from '../../session/Session';
import { SessionSchemas } from '../../session/types';

// Mock dependencies
const mockSession = {} as Session<SessionSchemas>;
const mockGenerateAuthorizationPage = vi.fn();
const mockHandleNoInteraction = vi.fn();
const mockBuildUnknownActionMessage = vi.fn();
const mockPath = '/';
describe('createProcessApiResponse', () => {
  const processApiResponse = createProcessApiResponse({
    session: mockSession,
    path: mockPath,
    generateAuthorizationPage: mockGenerateAuthorizationPage,
    handleNoInteraction: mockHandleNoInteraction,
    buildUnknownActionMessage: mockBuildUnknownActionMessage,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test cases for each action
  it('should handle INTERNAL_SERVER_ERROR action', async () => {
    const apiResponse: AuthorizationResponse = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: 'Internal Server Error',
    };
    const spy = vi.spyOn(responseFactory, 'internalServerError');

    await processApiResponse(apiResponse);

    expect(spy).toHaveBeenCalledWith('Internal Server Error');
  });

  it('should handle BAD_REQUEST action', async () => {
    const apiResponse: AuthorizationResponse = {
      action: 'BAD_REQUEST',
      responseContent: 'Bad Request',
    };
    const spy = vi.spyOn(responseFactory, 'badRequest');

    await processApiResponse(apiResponse);

    expect(spy).toHaveBeenCalledWith('Bad Request');
  });

  it('should handle LOCATION action', async () => {
    const apiResponse: AuthorizationResponse = {
      action: 'LOCATION',
      responseContent: 'https://example.com',
    };
    const spy = vi.spyOn(responseFactory, 'location');

    await processApiResponse(apiResponse);

    expect(spy).toHaveBeenCalledWith('https://example.com');
  });

  it('should handle FORM action', async () => {
    const apiResponse: AuthorizationResponse = {
      action: 'FORM',
      responseContent: '<form>...</form>',
    };
    const spy = vi.spyOn(responseFactory, 'form');

    await processApiResponse(apiResponse);

    expect(spy).toHaveBeenCalledWith('<form>...</form>');
  });

  it('should handle INTERACTION action', async () => {
    const apiResponse: AuthorizationResponse = {
      action: 'INTERACTION',
      responseContent: undefined,
    };

    await processApiResponse(apiResponse);

    expect(mockGenerateAuthorizationPage).toHaveBeenCalledWith(
      apiResponse,
      mockSession
    );
  });

  it('should handle NO_INTERACTION action', async () => {
    const apiResponse: AuthorizationResponse = {
      action: 'NO_INTERACTION',
      responseContent: undefined,
    };

    await processApiResponse(apiResponse);

    expect(mockHandleNoInteraction).toHaveBeenCalledWith(
      apiResponse,
      mockSession
    );
  });

  it('should handle unknown action', async () => {
    const apiResponse = {
      action: 'UNKNOWN_ACTION',
      responseContent: undefined,
    } as unknown as AuthorizationResponse;
    const spy = vi.spyOn(responseFactory, 'internalServerError');
    mockBuildUnknownActionMessage.mockReturnValue('Unknown action message');

    await processApiResponse(apiResponse);

    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      mockPath,
      'UNKNOWN_ACTION'
    );
    expect(spy).toHaveBeenCalledWith('Unknown action message');
  });
});
