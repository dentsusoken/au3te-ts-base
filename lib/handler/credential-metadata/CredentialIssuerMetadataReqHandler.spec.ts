import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CredentialIssuerMetadataReqHandler,
  CREDENTIAL_ISSUER_METADATA_PATH,
} from './CredentialIssuerMetadataReqHandler';
import { ApiClient } from 'au3te-ts-common/api';

describe('CredentialIssuerMetadataReqHandler', () => {
  let mockApiClient: ApiClient;

  beforeEach(() => {
    mockApiClient = {
      pushAuthorizationRequestPath: '/push-auth',
      callPostApi: vi.fn(),
    } as unknown as ApiClient;
  });

  it('should create an instance with default options', () => {
    const handler = new CredentialIssuerMetadataReqHandler(mockApiClient);

    expect(handler).toBeInstanceOf(CredentialIssuerMetadataReqHandler);
    expect(handler.path).toBe(CREDENTIAL_ISSUER_METADATA_PATH);
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

    const handler = new CredentialIssuerMetadataReqHandler(mockApiClient, {
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
