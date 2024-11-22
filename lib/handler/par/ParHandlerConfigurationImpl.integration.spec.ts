import { describe, it, expect } from 'vitest';
import { setupIntegrationTest } from '../../testing/setupIntegrationTest';

const { parHandlerConfiguration, createParRequest, createParParameters } =
  setupIntegrationTest();

describe('ParHandlerConfigurationImpl Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const response = await parHandlerConfiguration.handle(createParRequest());
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.expires_in).toBeDefined();
    expect(responseBody.request_uri).toBeDefined();
  }, 10000);

  it('should successfully process HTTP request', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createParParameters(),
    });

    const response = await parHandlerConfiguration.processRequest(request);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.expires_in).toBeDefined();
    expect(responseBody.request_uri).toBeDefined();
  }, 10000);
});
