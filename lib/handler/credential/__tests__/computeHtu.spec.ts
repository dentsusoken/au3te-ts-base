import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createComputeHtu } from '../computeHtu';
import { internalServerErrorResponseError } from '../../responseErrorFactory';

describe('computeHtu', () => {
  // Mock process API request function
  const mockProcessApiRequest = vi.fn();

  // Test endpoint name
  const testEndpointName = 'credential_endpoint';
  const testEndpointValue = 'https://example.com/credentials';

  // Setup mock response
  const mockMetadataResponse = {
    [testEndpointName]: testEndpointValue,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return undefined when dpop is not provided', async () => {
    const computeHtu = createComputeHtu({
      processCredentialIssuerMetadataRequestWithValidation:
        mockProcessApiRequest,
    });

    const result = await computeHtu(undefined, testEndpointName);
    expect(result).toBeUndefined();
    expect(mockProcessApiRequest).not.toHaveBeenCalled();
  });

  it('should return endpoint value from metadata when dpop is provided', async () => {
    mockProcessApiRequest.mockResolvedValueOnce({
      action: 'OK',
      responseContent: JSON.stringify(mockMetadataResponse),
    });

    const computeHtu = createComputeHtu({
      processCredentialIssuerMetadataRequestWithValidation:
        mockProcessApiRequest,
    });

    const result = await computeHtu('dummy-dpop-token', testEndpointName);
    expect(result).toBe(testEndpointValue);
    expect(mockProcessApiRequest).toHaveBeenCalledWith({});
  });

  it('should throw error when API response is not OK', async () => {
    const errorContent = 'API Error';
    mockProcessApiRequest.mockRejectedValueOnce(
      internalServerErrorResponseError(JSON.stringify({ error: errorContent }))
    );

    const computeHtu = createComputeHtu({
      processCredentialIssuerMetadataRequestWithValidation:
        mockProcessApiRequest,
    });

    await expect(
      computeHtu('dummy-dpop-token', testEndpointName)
    ).rejects.toEqual(
      internalServerErrorResponseError(JSON.stringify({ error: errorContent }))
    );
  });

  it('should return undefined when endpoint is not found in metadata', async () => {
    mockProcessApiRequest.mockResolvedValueOnce({
      action: 'OK',
      responseContent: JSON.stringify({}),
    });

    const computeHtu = createComputeHtu({
      processCredentialIssuerMetadataRequestWithValidation:
        mockProcessApiRequest,
    });

    const result = await computeHtu(
      'dummy-dpop-token',
      'non_existent_endpoint'
    );
    expect(result).toBeUndefined();
  });
});
