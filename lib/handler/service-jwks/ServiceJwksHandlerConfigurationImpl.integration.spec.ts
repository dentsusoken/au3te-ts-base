import { describe, it, expect } from 'vitest';
import { serviceJwksHandlerConfiguration } from '../../testing/configurations';
import { createServiceJwksRequest } from '../../testing/serviceJwks';

describe('ServiceConfigurationHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const request = createServiceJwksRequest();
    const response = await serviceJwksHandlerConfiguration.handle(request);
    const responseBody = await response.text();

    expect(response.status).toBe(200);
    expect(responseBody).toBeDefined();
  }, 10000);

  it('should successfully process HTTP request', async () => {
    const request = new Request('http://localhost');

    const response = await serviceJwksHandlerConfiguration.processRequest(
      request
    );
    const responseBody = await response.text();

    expect(response.status).toBe(200);
    expect(responseBody).toBeDefined();
  }, 10000);
});
