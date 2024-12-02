import { describe, it, expect } from 'vitest';
import { credentialMetadataHandlerConfiguration } from '../../testing/configurations';
import { createCredentialIssuerMetadataRequest } from '../../testing/credentialIssuerMetadata';

describe('CredentialMetadataHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const request = createCredentialIssuerMetadataRequest();

    const response = await credentialMetadataHandlerConfiguration.handle(
      request
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.credential_issuer).toBeDefined();
  }, 10000);

  it('should successfully process HTTP request', async () => {
    const request = new Request('http://localhost');

    const response =
      await credentialMetadataHandlerConfiguration.processRequest(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.credential_issuer).toBeDefined();
  }, 10000);
});
