import { describe, it, expect, vi, afterEach } from 'vitest';
import { ServiceConfReqEndpoint } from './ServiceConfReqEndpoint';
import { ApiClient } from 'au3te-ts-common/api';
import { ServiceConfReqHandler } from '../../handler/service-configuration/ServiceConfReqHandler';
import { createToApiRequest } from './toApiRequest';
import { createProcessRequest } from '../processRequest';

vi.mock('../../handler/service-configuration/ServiceConfReqHandler');
vi.mock('./toApiRequest');
vi.mock('../processRequest');

describe('ServiceConfReqEndpoint', () => {
  const mockApiClient = {} as ApiClient;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default options with mocks', () => {
    const endpoint = new ServiceConfReqEndpoint(mockApiClient);

    expect(endpoint).toBeInstanceOf(ServiceConfReqEndpoint);
    expect(endpoint.apiClient).toBe(mockApiClient);
    expect(endpoint.handler).toBeInstanceOf(ServiceConfReqHandler);
    expect(createToApiRequest).toHaveBeenCalled();
    expect(createProcessRequest).toHaveBeenCalled();
  });

  it('should use custom toApiRequest if provided', () => {
    const mockToApiRequest = vi.fn();
    const endpoint = new ServiceConfReqEndpoint(mockApiClient, {
      toApiRequest: mockToApiRequest,
    });

    expect(endpoint.toApiRequest).toBe(mockToApiRequest);
    expect(createToApiRequest).not.toHaveBeenCalled();
  });

  it('should use custom processRequest if provided', () => {
    const mockProcessRequest = vi.fn();
    const endpoint = new ServiceConfReqEndpoint(mockApiClient, {
      processRequest: mockProcessRequest,
    });

    expect(endpoint.processRequest).toBe(mockProcessRequest);
    expect(createProcessRequest).not.toHaveBeenCalled();
  });

  it('should pass options to ServiceConfReqHandler', () => {
    const customOptions = {
      extractParameters: vi.fn(),
      extractClientCredentials: vi.fn(),
      extractClientCertificateAndPath: vi.fn(),
    };
    new ServiceConfReqEndpoint(mockApiClient, customOptions);

    expect(ServiceConfReqHandler).toHaveBeenCalledWith(
      mockApiClient,
      customOptions
    );
  });

  it('should create processRequest with correct parameters', () => {
    const endpoint = new ServiceConfReqEndpoint(mockApiClient);

    expect(createProcessRequest).toHaveBeenCalledWith({
      toApiRequest: endpoint.toApiRequest,
      handle: endpoint.handler.handle,
    });
  });
});
