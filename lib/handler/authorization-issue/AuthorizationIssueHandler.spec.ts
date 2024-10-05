import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AuthorizationIssueHandler,
  AUTHORIZATION_ISSUE_PATH,
} from './AuthorizationIssueHandler';
import { ApiClient } from 'au3te-ts-common/api';

describe('AuthorizationIssueHandler', () => {
  let mockApiClient: ApiClient;

  beforeEach(() => {
    mockApiClient = {
      authorizationFailPath: '/auth-issue',
      callPostApi: vi.fn(),
    } as unknown as ApiClient;
  });

  it('should create an instance with default options', () => {
    const handler = new AuthorizationIssueHandler(mockApiClient);

    expect(handler).toBeInstanceOf(AuthorizationIssueHandler);
    expect(handler.path).toBe(AUTHORIZATION_ISSUE_PATH);
    expect(handler.apiClient).toBe(mockApiClient);
    expect(handler.processApiResponse).toBeDefined();
    expect(handler.processApiRequest).toBeDefined();
    expect(handler.recoverResponseResult).toBeDefined();
    expect(handler.handle).toBeDefined();
  });

  it('should create an instance with custom options', () => {
    const mockProcessApiResponse = vi.fn();
    const mockProcessApiRequest = vi.fn();
    const mockRecoverResponseResult = vi.fn();
    const mockHandle = vi.fn();

    const handler = new AuthorizationIssueHandler(mockApiClient, {
      processApiResponse: mockProcessApiResponse,
      processApiRequest: mockProcessApiRequest,
      recoverResponseResult: mockRecoverResponseResult,
      handle: mockHandle,
    });

    expect(handler.processApiResponse).toBe(mockProcessApiResponse);
    expect(handler.processApiRequest).toBe(mockProcessApiRequest);
    expect(handler.recoverResponseResult).toBe(mockRecoverResponseResult);
    expect(handler.handle).toBe(mockHandle);
  });
});
