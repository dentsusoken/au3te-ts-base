import { describe, it, expect } from 'vitest';
import { authorizationIssueHandlerConfiguration } from '../../../testing/configurations';
import { processParPostRequest } from '../../../testing/par';
import { processAuthorizationGetRequest } from '../../../testing/authorization';
import { createAuthorizationIssueRequest } from '../../../testing/authorizationIssue';

describe('AuthorizationIssueHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const requestUri = await processParPostRequest();
    const ticket = await processAuthorizationGetRequest(requestUri);

    const request = createAuthorizationIssueRequest(ticket);
    const response = await authorizationIssueHandlerConfiguration.handle(
      request
    );

    expect(response.status).toBe(302);
    const locationHeader = response.headers.get('Location');
    expect(locationHeader).toBeDefined();
    expect(locationHeader?.startsWith('eudi-openid4ci://authorize/?')).toBe(
      true
    );
    const searchParams = new URL(locationHeader!).searchParams;
    expect(searchParams.get('state')).toBe('1234567890');
    expect(searchParams.get('code')).toBeDefined();
    expect(searchParams.get('iss')).toBeDefined();
  }, 10000);
});
