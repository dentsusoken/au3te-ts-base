import { describe, it, expect, vi } from 'vitest';
import { createToApiRequest } from './toApiRequest';

describe('createToApiRequest', () => {
  const mockExtractParameters = vi.fn();
  const mockExtractClientCredentials = vi.fn();
  const mockExtractClientCertificateAndPath = vi.fn();

  const toApiRequest = createToApiRequest({
    extractParameters: mockExtractParameters,
    extractClientCredentials: mockExtractClientCredentials,
    extractClientCertificateAndPath: mockExtractClientCertificateAndPath,
  });

  it('should create a PushedAuthReqRequest from a Request', async () => {
    const mockRequest = {
      headers: new Headers({
        DPoP: 'dpop-token',
        'OAuth-Client-Attestation': 'attestation-token',
        'OAuth-Client-Attestation-PoP': 'attestation-pop-token',
      }),
    } as Request;

    mockExtractParameters.mockResolvedValue('param1=value1&param2=value2');
    mockExtractClientCredentials.mockResolvedValue({
      clientId: 'client123',
      clientSecret: 'secret456',
    });
    mockExtractClientCertificateAndPath.mockResolvedValue({
      clientCertificate: 'cert',
      clientCertificatePath: ['path'],
    });

    const result = await toApiRequest(mockRequest);

    expect(result).toEqual({
      parameters: 'param1=value1&param2=value2',
      clientId: 'client123',
      clientSecret: 'secret456',
      clientCertificate: 'cert',
      clientCertificatePath: ['path'],
      dpop: 'dpop-token',
      htm: 'POST',
      oauthClientAttestation: 'attestation-token',
      oauthClientAttestationPop: 'attestation-pop-token',
    });

    expect(mockExtractParameters).toHaveBeenCalledWith(mockRequest);
    expect(mockExtractClientCredentials).toHaveBeenCalledWith(mockRequest);
    expect(mockExtractClientCertificateAndPath).toHaveBeenCalledWith(
      mockRequest
    );
  });

  it('should handle missing headers', async () => {
    const mockRequest = {
      headers: new Headers(),
    } as Request;

    mockExtractParameters.mockResolvedValue('');
    mockExtractClientCredentials.mockResolvedValue({
      clientId: undefined,
      clientSecret: undefined,
    });
    mockExtractClientCertificateAndPath.mockResolvedValue({
      clientCertificate: undefined,
      clientCertificatePath: undefined,
    });

    const result = await toApiRequest(mockRequest);

    expect(result).toEqual({
      parameters: '',
      clientId: undefined,
      clientSecret: undefined,
      clientCertificate: undefined,
      clientCertificatePath: undefined,
      dpop: null,
      htm: 'POST',
      oauthClientAttestation: null,
      oauthClientAttestationPop: null,
    });
  });
});
