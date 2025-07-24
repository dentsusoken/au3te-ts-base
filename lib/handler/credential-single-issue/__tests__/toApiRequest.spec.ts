import { describe, it, expect, vi } from 'vitest';
import { createToApiRequest } from '../toApiRequest';
import { BadRequestError } from '@vecrea/au3te-ts-common/handler';
import { INVALID_CREDENTIAL_SINGLE_ISSUE_REQUEST } from '../errorCode';
import { CredentialRequestInfo } from '@vecrea/au3te-ts-common/schemas.credential';
import { runAsyncCatching } from '@vecrea/oid4vc-core/utils';
import { defaultResponseFactory } from '../../responseFactory';
import { createResponseErrorFactory } from '../../responseErrorFactory';

describe('createToApiRequest', () => {
  // Mock functions
  const mockExtractAccessToken = vi.fn();
  const mockExtractClientCertificateAndPath = vi.fn();
  const mockExtractParameters = vi.fn();
  const mockComputeHtu = vi.fn();
  const mockProcessApiRequestWithValidation = vi.fn();
  const mockPrepareHeaders = vi.fn();
  const mockGetToOrder = vi.fn();
  const mockToOrder = vi.fn();

  const responseErrorFactory = createResponseErrorFactory(
    defaultResponseFactory
  );

  // Test setup
  const setup = () => {
    const params = {
      extractAccessToken: mockExtractAccessToken,
      extractClientCertificateAndPath: mockExtractClientCertificateAndPath,
      extractParameters: mockExtractParameters,
      computeHtu: mockComputeHtu,
      introspect: mockProcessApiRequestWithValidation,
      prepareHeaders: mockPrepareHeaders,
      parseSingleCredential: mockProcessApiRequestWithValidation,
      getToOrder: mockGetToOrder,
      responseErrorFactory,
    };

    return createToApiRequest(params);
  };

  it('should throw BadRequestError when access token is missing', async () => {
    // Arrange
    const toApiRequest = setup();
    mockExtractAccessToken.mockReturnValue(null);
    const request = new Request('https://example.com');

    // Act & Assert
    await expect(toApiRequest(request)).rejects.toThrow(
      new BadRequestError(
        INVALID_CREDENTIAL_SINGLE_ISSUE_REQUEST,
        'Access token is required'
      )
    );
  });

  it('should throw BadRequestError when credential request info is missing', async () => {
    // Arrange
    const toApiRequest = setup();
    const mockHeaders = { headers: 'value' };
    mockExtractAccessToken.mockReturnValue('access_token');
    mockExtractClientCertificateAndPath.mockResolvedValue({
      clientCertificate: 'cert',
    });
    mockExtractParameters.mockResolvedValue({ param: 'value' });
    mockComputeHtu.mockResolvedValue('htu_value');
    mockProcessApiRequestWithValidation.mockResolvedValue({
      dpopNonce: 'nonce',
    });
    mockPrepareHeaders.mockReturnValue(mockHeaders);
    mockProcessApiRequestWithValidation.mockResolvedValue({ info: null });

    const request = new Request('https://example.com', {
      headers: new Headers({ dpop: 'dpop_value' }),
    });

    // Act & Assert
    await expect(toApiRequest(request)).rejects.toThrow(
      new BadRequestError(
        INVALID_CREDENTIAL_SINGLE_ISSUE_REQUEST,
        'Credential request info is missing in the parse response'
      )
    );
  });

  it('should successfully create a credential single issue request with issuanceDeferred', async () => {
    // Arrange
    const toApiRequest = setup();
    const mockHeaders = { headers: 'value' };
    const mockCredentialRequestInfo: CredentialRequestInfo = {
      format: 'mso_mdoc',
      identifier: 'identifier',
    };
    const mockOrder = {
      requestIdentifier: 'request_id',
    };

    mockExtractAccessToken.mockReturnValue('access_token');
    mockExtractClientCertificateAndPath.mockResolvedValue({
      clientCertificate: 'cert',
    });
    mockExtractParameters.mockResolvedValue({ param: 'value' });
    mockComputeHtu.mockResolvedValue('htu_value');
    mockProcessApiRequestWithValidation.mockResolvedValue({
      dpopNonce: 'nonce',
    });
    mockPrepareHeaders.mockReturnValue(mockHeaders);
    mockProcessApiRequestWithValidation.mockResolvedValue({
      info: mockCredentialRequestInfo,
    });
    mockGetToOrder.mockReturnValue(mockToOrder);
    mockToOrder.mockImplementation(async () => {
      const result = await runAsyncCatching(async () => mockOrder);
      return result.value!;
    });

    const request = new Request('https://example.com?deferred=true', {
      headers: new Headers({ dpop: 'dpop_value' }),
    });

    // Act
    const result = await toApiRequest(request);

    // Assert
    expect(result).toEqual({
      apiRequest: {
        accessToken: 'access_token',
        order: {
          ...mockOrder,
          issuanceDeferred: true,
        },
      },
      options: {
        accessToken: 'access_token',
        headers: mockHeaders,
      },
    });
  });

  it('should successfully create a credential single issue request without issuanceDeferred', async () => {
    // Arrange
    const toApiRequest = setup();
    const mockHeaders = { headers: 'value' };
    const mockCredentialRequestInfo: CredentialRequestInfo = {
      format: 'mso_mdoc',
      identifier: 'identifier',
    };
    const mockOrder = {
      requestIdentifier: 'request_id',
    };

    mockExtractAccessToken.mockReturnValue('access_token');
    mockExtractClientCertificateAndPath.mockResolvedValue({
      clientCertificate: 'cert',
    });
    mockExtractParameters.mockResolvedValue({ param: 'value' });
    mockComputeHtu.mockResolvedValue('htu_value');
    mockProcessApiRequestWithValidation.mockResolvedValue({
      dpopNonce: 'nonce',
    });
    mockPrepareHeaders.mockReturnValue(mockHeaders);
    mockProcessApiRequestWithValidation.mockResolvedValue({
      info: mockCredentialRequestInfo,
    });
    mockGetToOrder.mockReturnValue(mockToOrder);
    mockToOrder.mockImplementation(async () => {
      const result = await runAsyncCatching(async () => mockOrder);
      return result.value!;
    });

    const request = new Request('https://example.com', {
      headers: new Headers({ dpop: 'dpop_value' }),
    });

    // Act
    const result = await toApiRequest(request);

    // Assert
    expect(result).toEqual({
      apiRequest: {
        accessToken: 'access_token',
        order: mockOrder,
      },
      options: {
        accessToken: 'access_token',
        headers: mockHeaders,
      },
    });
  });
});
