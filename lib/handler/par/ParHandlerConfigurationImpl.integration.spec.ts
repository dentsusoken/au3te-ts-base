import { describe, it, expect } from 'vitest';
import { parHandlerConfiguration } from '../../testing/configurations';
import { createParRequest, createParPostRequest } from '../../testing/par';

describe('ParHandlerConfigurationImpl Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const request = createParRequest();
    const response = await parHandlerConfiguration.handle(request);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.expires_in).toBeDefined();
    expect(responseBody.request_uri).toBeDefined();
  }, 10000);

  it('should successfully process HTTP request', async () => {
    const request = createParPostRequest();
    const response = await parHandlerConfiguration.processRequest(request);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.expires_in).toBeDefined();
    expect(responseBody.request_uri).toBeDefined();
  }, 10000);
});
