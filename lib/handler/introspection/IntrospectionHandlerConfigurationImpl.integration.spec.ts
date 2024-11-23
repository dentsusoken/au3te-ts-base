import { describe, it, expect } from 'vitest';
import { setupIntegrationTest } from '../../testing/setupIntegrationTest';

const {
  introspectionHandlerConfiguration,
  processParPostRequest,
  processAuthorizationGetRequest,
  processAuthorizationDecisionPostRequest,
  processTokenPostRequest,
  createIntrospectionRequest,
} = setupIntegrationTest();

describe('IntrospectionHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);
    const code = await processAuthorizationDecisionPostRequest();
    const accessToken = await processTokenPostRequest(code);

    const request = createIntrospectionRequest(accessToken);
    await expect(
      introspectionHandlerConfiguration.processApiRequestWithValidation(request)
    ).resolves.not.toThrow();
  }, 10000);
});
