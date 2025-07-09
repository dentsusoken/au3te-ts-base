import { describe, it, expect } from 'vitest';
import { serviceConfigurationHandlerConfiguration } from '../../../testing/configurations';
import { createServiceConfigurationRequest } from '../../../testing/serviceConfiguration';

describe('ServiceConfigurationHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const request = createServiceConfigurationRequest();
    const response = await serviceConfigurationHandlerConfiguration.handle(
      request
    );
    const responseBody = await response.text();

    expect(response.status).toBe(200);
    expect(responseBody).toBeDefined();
  }, 10000);

  it('should successfully process HTTP request', async () => {
    const request = new Request('http://localhost');

    const response =
      await serviceConfigurationHandlerConfiguration.processRequest(request);
    const responseBody = await response.text();

    expect(response.status).toBe(200);
    expect(responseBody).toBeDefined();
  }, 10000);
});
