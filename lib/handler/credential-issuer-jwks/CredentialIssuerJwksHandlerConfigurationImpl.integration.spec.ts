import { describe, it, expect } from 'vitest';
import { credentialIssuerJwksHandlerConfiguration } from '../../testing/configurations';
import { createCredentialIssuerJwksRequest } from '../../testing/credentialIssuerJwks';

describe('CredentialMetadataHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const request = createCredentialIssuerJwksRequest();

    const response = await credentialIssuerJwksHandlerConfiguration.handle(
      request
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.keys).toBeDefined();
  }, 10000);

  it('should successfully process HTTP request', async () => {
    const request = new Request('http://localhost');

    const response =
      await credentialIssuerJwksHandlerConfiguration.processRequest(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.keys).toBeDefined();
  }, 10000);
});
