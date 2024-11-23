import { describe, it, expect } from 'vitest';
import { setupIntegrationTest } from '../../testing/setupIntegrationTest';

const {
  authorizationIssueHandlerConfiguration,
  processParPostRequest,
  processAuthorizationGetRequest,
  createAuthorizationIssueRequest,
} = setupIntegrationTest();

describe('AuthorizationIssueHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const requestUri = await processParPostRequest();
    const ticket = await processAuthorizationGetRequest(requestUri);

    const request = createAuthorizationIssueRequest(ticket);
    const response = await authorizationIssueHandlerConfiguration.handle(
      request
    );

    expect(response.status).toBe(302);
    expect(
      response.headers
        .get('Location')
        ?.startsWith('eudi-openid4ci://authorize/?code=')
    ).toBe(true);
  }, 10000);
});