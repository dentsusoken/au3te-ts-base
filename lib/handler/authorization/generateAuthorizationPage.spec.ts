import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGenerateAuthorizationPage } from './generateAuthorizationPage';
import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';
import * as pageModel from 'au3te-ts-common/page-model.authorization';
import { BaseSession } from '../../session/BaseSession';

// Mock dependencies
vi.mock('au3te-ts-common/page-model.authorization');

describe('createGenerateAuthorizationPage', () => {
  const mockSession = {
    setBatch: vi.fn(),
    get: vi.fn(),
  } as unknown as BaseSession;
  const mockResponseToDecisionParams = vi.fn();
  const mockClearCurrentUserInfoInSessionIfNecessary = vi.fn();
  const mockBuildResponse = vi.fn();
  let generateAuthorizationPage: ReturnType<
    typeof createGenerateAuthorizationPage
  >;

  beforeEach(() => {
    vi.clearAllMocks();

    generateAuthorizationPage = createGenerateAuthorizationPage({
      responseToDecisionParams: mockResponseToDecisionParams,
      clearCurrentUserInfoInSessionIfNecessary:
        mockClearCurrentUserInfoInSessionIfNecessary,
      buildResponse: mockBuildResponse,
    });
  });

  it('should process the authorization response correctly', async () => {
    // Arrange
    const mockResponse: AuthorizationResponse = {
      action: 'INTERACTION',
      acrs: ['acr1'],
      client: { clientId: 'test-client' },
    };
    const mockDecisionParams = { decision: 'allow' };
    const mockUser = { id: 'user1' };
    const mockModel = { page: 'authorization' };

    mockResponseToDecisionParams.mockReturnValue(mockDecisionParams);
    vi.mocked(mockSession.get).mockResolvedValue(mockUser);
    vi.spyOn(pageModel, 'buildAuthorizationPageModel').mockReturnValue({
      authorizationResponse: mockResponse,
      ...mockModel,
    });
    const mockResponseObject = new Response();
    mockBuildResponse.mockResolvedValue(mockResponseObject);

    // Act
    const result = await generateAuthorizationPage(mockResponse, mockSession);

    // Assert
    expect(mockSession.setBatch).toHaveBeenCalledWith({
      authorizationDecisionParams: mockDecisionParams,
      acrs: mockResponse.acrs,
      client: mockResponse.client,
    });
    expect(mockClearCurrentUserInfoInSessionIfNecessary).toHaveBeenCalledWith(
      mockResponse,
      mockSession
    );
    expect(mockSession.get).toHaveBeenCalledWith('user');
    expect(pageModel.buildAuthorizationPageModel).toHaveBeenCalledWith(
      mockResponse,
      mockUser
    );
    expect(mockBuildResponse).toHaveBeenCalledWith({
      authorizationResponse: mockResponse,
      ...mockModel,
    });
    expect(result).toBe(mockResponseObject);
  });
});
