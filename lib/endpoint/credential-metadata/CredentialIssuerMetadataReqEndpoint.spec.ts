import { describe, it, expect, vi, afterEach } from 'vitest';
import { CredentialIssuerMetadataReqEndpoint } from './CredentialIssuerMetadataReqEndpoint';
import { ApiClient } from 'au3te-ts-common/api';
import { CredentialIssuerMetadataReqHandler } from '../../handler/credential-metadata/CredentialIssuerMetadataReqHandler';
import { createToApiRequest } from './toApiRequest';
import { createProcessRequest } from '../processRequest';

vi.mock('../../handler/credential-metadata/CredentialIssuerMetadataReqHandler');
vi.mock('./toApiRequest');
vi.mock('../processRequest');

describe('CredentialIssuerMetadataReqEndpoint', () => {
  const mockApiClient = {} as ApiClient;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default options with mocks', () => {
    const endpoint = new CredentialIssuerMetadataReqEndpoint(mockApiClient);

    expect(endpoint).toBeInstanceOf(CredentialIssuerMetadataReqEndpoint);
    expect(endpoint.apiClient).toBe(mockApiClient);
    expect(endpoint.handler).toBeInstanceOf(CredentialIssuerMetadataReqHandler);
    expect(createToApiRequest).toHaveBeenCalled();
    expect(createProcessRequest).toHaveBeenCalled();
  });

  it('should use custom toApiRequest if provided', () => {
    const mockToApiRequest = vi.fn();
    const endpoint = new CredentialIssuerMetadataReqEndpoint(mockApiClient, {
      toApiRequest: mockToApiRequest,
    });

    expect(endpoint.toApiRequest).toBe(mockToApiRequest);
    expect(createToApiRequest).not.toHaveBeenCalled();
  });

  it('should use custom processRequest if provided', () => {
    const mockProcessRequest = vi.fn();
    const endpoint = new CredentialIssuerMetadataReqEndpoint(mockApiClient, {
      processRequest: mockProcessRequest,
    });

    expect(endpoint.processRequest).toBe(mockProcessRequest);
    expect(createProcessRequest).not.toHaveBeenCalled();
  });

  it('should pass options to CredentialIssuerMetadataReqEndpoint', () => {
    const customOptions = {
      extractParameters: vi.fn(),
      extractClientCredentials: vi.fn(),
      extractClientCertificateAndPath: vi.fn(),
    };
    new CredentialIssuerMetadataReqEndpoint(mockApiClient, customOptions);

    expect(CredentialIssuerMetadataReqHandler).toHaveBeenCalledWith(
      mockApiClient,
      customOptions
    );
  });

  it('should create processRequest with correct parameters', () => {
    const endpoint = new CredentialIssuerMetadataReqEndpoint(mockApiClient);

    expect(createProcessRequest).toHaveBeenCalledWith({
      toApiRequest: endpoint.toApiRequest,
      handle: endpoint.handler.handle,
    });
  });
});
