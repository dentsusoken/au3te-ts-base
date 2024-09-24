import { describe, it, expect, vi } from 'vitest';
import {
  AuthorizationFailEndpoint,
  AUTHORIZATION_FAIL_PATH,
} from './AuthorizationFailEndpoint';
import { createProcessApiResponse } from './processApiResponse';
import { defaultProcessApiRequest } from './processApiRequest';
import { createRecoverResponseResult } from '../recoverResponseResult';
import { createPost } from './post';

// Mock the imported functions
vi.mock('./processApiResponse', () => ({
  createProcessApiResponse: vi.fn(),
}));
vi.mock('./processApiRequest', () => ({
  defaultProcessApiRequest: vi.fn(),
}));
vi.mock('../recoverResponseResult', () => ({
  createRecoverResponseResult: vi.fn(),
}));
vi.mock('./post', () => ({
  createPost: vi.fn(),
}));

describe('AuthorizationFailEndpoint', () => {
  it('should initialize with default values', () => {
    const endpoint = new AuthorizationFailEndpoint();

    expect(endpoint.path).toBe(AUTHORIZATION_FAIL_PATH);
    expect(createProcessApiResponse).toHaveBeenCalledWith(
      endpoint.buildUnknownActionMessage
    );
    expect(endpoint.processApiRequest).toBe(defaultProcessApiRequest);
    expect(createRecoverResponseResult).toHaveBeenCalledWith(
      endpoint.processError
    );
    expect(createPost).toHaveBeenCalledWith({
      processApiRequest: endpoint.processApiRequest,
      processApiResponse: endpoint.processApiResponse,
      recoverResponseResult: endpoint.recoverResponseResult,
    });
  });

  it('should use provided options when initializing', () => {
    const mockProcessApiResponse = vi.fn();
    const mockProcessApiRequest = vi.fn();
    const mockRecoverResponseResult = vi.fn();
    const mockPost = vi.fn();

    const endpoint = new AuthorizationFailEndpoint({
      processApiResponse: mockProcessApiResponse,
      processApiRequest: mockProcessApiRequest,
      recoverResponseResult: mockRecoverResponseResult,
      post: mockPost,
    });

    expect(endpoint.path).toBe(AUTHORIZATION_FAIL_PATH);
    expect(endpoint.processApiResponse).toBe(mockProcessApiResponse);
    expect(endpoint.processApiRequest).toBe(mockProcessApiRequest);
    expect(endpoint.recoverResponseResult).toBe(mockRecoverResponseResult);
    expect(endpoint.post).toBe(mockPost);
  });

  it('should inherit properties from BaseEndpoint', () => {
    const mockBuildUnknownActionMessage = vi.fn();
    const mockProcessError = vi.fn();

    const endpoint = new AuthorizationFailEndpoint({
      buildUnknownActionMessage: mockBuildUnknownActionMessage,
      processError: mockProcessError,
    });

    expect(endpoint.buildUnknownActionMessage).toBe(
      mockBuildUnknownActionMessage
    );
    expect(endpoint.processError).toBe(mockProcessError);
  });
});
