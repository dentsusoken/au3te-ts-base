import { describe, it, expect } from 'vitest';
import { setupIntegrationTest } from '../../testing/setupIntegrationTest';

const {
  authorizationDecisionHandlerConfiguration,
  processParPostRequest,
  processAuthorizationGetRequest,
  createAuthorizationDecisionGetRequest,
  createAuthorizationDecisionPostRequest,
} = setupIntegrationTest();

describe('AuthorizationDecisionHandlerConfiguration Integration Tests', () => {
  it('should successfully process GET request', async () => {
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);

    const request = createAuthorizationDecisionGetRequest();
    const response =
      await authorizationDecisionHandlerConfiguration.processRequest(request);

    expect(response.status).toBe(302);
    const locationHeader = response.headers.get('Location');
    expect(locationHeader).toBeDefined();
    expect(
      locationHeader?.startsWith('eudi-openid4ci://authorize/?code=')
    ).toBe(true);
  }, 10000);

  it('should successfully process POST request', async () => {
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);

    const request = createAuthorizationDecisionPostRequest();
    const response =
      await authorizationDecisionHandlerConfiguration.processRequest(request);

    expect(response.status).toBe(302);
    const locationHeader = response.headers.get('Location');
    expect(locationHeader).toBeDefined();
    expect(
      locationHeader?.startsWith('eudi-openid4ci://authorize/?code=')
    ).toBe(true);
  }, 10000);
});
