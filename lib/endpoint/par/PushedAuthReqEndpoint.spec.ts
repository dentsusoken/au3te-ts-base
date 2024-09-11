import { describe, it, expect, vi } from 'vitest';
import { PushedAuthReqEndpoint, PAR_PATH } from './PushedAuthReqEndpoint';
import { createProcessApiResponse } from './processApiResponse';
import { defaultProcessApiRequest } from './processApiRequest';
import { createToApiRequest } from './toApiRequest';
import { createPost } from './post';

// Mock the imported functions
vi.mock('./processApiResponse', () => ({
  createProcessApiResponse: vi.fn(),
}));
vi.mock('./processApiRequest', () => ({
  defaultProcessApiRequest: vi.fn(),
}));
vi.mock('./toApiRequest', () => ({
  createToApiRequest: vi.fn(),
}));
vi.mock('./post', () => ({
  createPost: vi.fn(),
}));

describe('PushedAuthReqEndpoint', () => {
  it('should initialize with default values', () => {
    const endpoint = new PushedAuthReqEndpoint();

    expect(endpoint.path).toBe(PAR_PATH);
    expect(createProcessApiResponse).toHaveBeenCalledWith(
      endpoint.buildUnknownActionMessage
    );
    expect(endpoint.processApiRequest).toBe(defaultProcessApiRequest);
    expect(createToApiRequest).toHaveBeenCalledWith({
      extractParameters: endpoint.extractParameters,
      extractClientCredentials: endpoint.extractClientCredentials,
      extractClientCertificateAndPath: endpoint.extractClientCertificateAndPath,
    });
    expect(createPost).toHaveBeenCalledWith({
      toApiRequest: endpoint.toApiRequest,
      processApiRequest: endpoint.processApiRequest,
      processApiResponse: endpoint.processApiResponse,
      processError: endpoint.processError,
    });
  });

  it('should use provided options when initializing', () => {
    const mockProcessApiResponse = vi.fn();
    const mockProcessApiRequest = vi.fn();
    const mockToApiRequest = vi.fn();
    const mockPost = vi.fn();

    const endpoint = new PushedAuthReqEndpoint({
      processApiResponse: mockProcessApiResponse,
      processApiRequest: mockProcessApiRequest,
      toApiRequest: mockToApiRequest,
      post: mockPost,
    });

    expect(endpoint.path).toBe(PAR_PATH);
    expect(endpoint.processApiResponse).toBe(mockProcessApiResponse);
    expect(endpoint.processApiRequest).toBe(mockProcessApiRequest);
    expect(endpoint.toApiRequest).toBe(mockToApiRequest);
    expect(endpoint.post).toBe(mockPost);
  });

  it('should inherit properties from BaseEndpoint', () => {
    const mockExtractParameters = vi.fn();
    const mockExtractClientCredentials = vi.fn();
    const mockExtractClientCertificateAndPath = vi.fn();

    const endpoint = new PushedAuthReqEndpoint({
      extractParameters: mockExtractParameters,
      extractClientCredentials: mockExtractClientCredentials,
      extractClientCertificateAndPath: mockExtractClientCertificateAndPath,
    });

    expect(endpoint.extractParameters).toBe(mockExtractParameters);
    expect(endpoint.extractClientCredentials).toBe(
      mockExtractClientCredentials
    );
    expect(endpoint.extractClientCertificateAndPath).toBe(
      mockExtractClientCertificateAndPath
    );
  });
});
