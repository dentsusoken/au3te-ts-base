import { describe, it, expect, vi, afterEach } from 'vitest';
import { PushedAuthReqEndpoint } from './PushedAuthReqEndpoint';
import { ApiClient } from 'au3te-ts-common/api';
import { PushedAuthReqHandler } from '../../handler/par/PushedAuthReqHandler';
import { createToApiRequest } from './toApiRequest';
import { createProcessRequest } from '../processRequest';

vi.mock('../../handler/par/PushedAuthReqHandler');
vi.mock('./toApiRequest');
vi.mock('../processRequest');

describe('PushedAuthReqEndpoint', () => {
  const mockApiClient = {} as ApiClient;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default options with mocks', () => {
    const endpoint = new PushedAuthReqEndpoint(mockApiClient);

    expect(endpoint).toBeInstanceOf(PushedAuthReqEndpoint);
    expect(endpoint.apiClient).toBe(mockApiClient);
    expect(endpoint.handler).toBeInstanceOf(PushedAuthReqHandler);
    expect(createToApiRequest).toHaveBeenCalled();
    expect(createProcessRequest).toHaveBeenCalled();
  });

  it('should use custom toApiRequest if provided', () => {
    const mockToApiRequest = vi.fn();
    const endpoint = new PushedAuthReqEndpoint(mockApiClient, {
      toApiRequest: mockToApiRequest,
    });

    expect(endpoint.toApiRequest).toBe(mockToApiRequest);
    expect(createToApiRequest).not.toHaveBeenCalled();
  });

  it('should use custom processRequest if provided', () => {
    const mockProcessRequest = vi.fn();
    const endpoint = new PushedAuthReqEndpoint(mockApiClient, {
      processRequest: mockProcessRequest,
    });

    expect(endpoint.processRequest).toBe(mockProcessRequest);
    expect(createProcessRequest).not.toHaveBeenCalled();
  });

  it('should pass options to PushedAuthReqHandler', () => {
    const customOptions = {
      extractParameters: vi.fn(),
      extractClientCredentials: vi.fn(),
      extractClientCertificateAndPath: vi.fn(),
    };
    new PushedAuthReqEndpoint(mockApiClient, customOptions);

    expect(PushedAuthReqHandler).toHaveBeenCalledWith(
      mockApiClient,
      customOptions
    );
  });

  it('should create toApiRequest with correct parameters', () => {
    const endpoint = new PushedAuthReqEndpoint(mockApiClient);

    expect(createToApiRequest).toHaveBeenCalledWith({
      extractParameters: endpoint.extractParameters,
      extractClientCredentials: endpoint.extractClientCredentials,
      extractClientCertificateAndPath: endpoint.extractClientCertificateAndPath,
    });
  });

  it('should create processRequest with correct parameters', () => {
    const endpoint = new PushedAuthReqEndpoint(mockApiClient);

    expect(createProcessRequest).toHaveBeenCalledWith({
      toApiRequest: endpoint.toApiRequest,
      handle: endpoint.handler.handle,
    });
  });
});
