import { describe, it, expect } from 'vitest';
import { authorizationIssueHandlerConfiguration } from '../../testing/configurations';
import { processParPostRequest } from '../../testing/par';
import { processAuthorizationGetRequest } from '../../testing/authorization';
import { createAuthorizationIssueRequest } from '../../testing/authorizationIssue';

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
