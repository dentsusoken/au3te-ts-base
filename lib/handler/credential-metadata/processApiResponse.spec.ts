import { describe, it, expect, vi } from 'vitest';
import { CredentialIssuerMetadataResponse } from 'au3te-ts-common/schemas.credential-metadata';
import { createProcessApiResponse } from './processApiResponse';

describe('createProcessApiResponse', () => {
  const mockBuildUnknownActionMessage = vi.fn(
    (action) => `Unknown action: ${action}`
  );
  const processApiResponse = createProcessApiResponse(
    mockBuildUnknownActionMessage
  );

  it('should handle OK action', async () => {
    const apiResponse = {
      action: 'OK',
      responseContent: 'Ok content',
    } as CredentialIssuerMetadataResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Ok content');
  });

  it('should handle NOT_FOUND action', async () => {
    const apiResponse = {
      action: 'NOT_FOUND',
      responseContent: 'Not found content',
    } as CredentialIssuerMetadataResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Not found content');
  });

  it('should handle INTERNAL_SERVER_ERROR action', async () => {
    const apiResponse = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: 'Internal server error content',
    } as CredentialIssuerMetadataResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Internal server error content');
  });

  it('should handle unknown action', async () => {
    const apiResponse = {
      action: 'UNKNOWN_ACTION',
    } as unknown as CredentialIssuerMetadataResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Unknown action: UNKNOWN_ACTION');
    expect(mockBuildUnknownActionMessage).toHaveBeenCalledWith(
      'UNKNOWN_ACTION'
    );
  });
});
