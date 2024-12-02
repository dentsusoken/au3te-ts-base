import { describe, it, expect } from 'vitest';
import { authorizationFailHandlerConfiguration } from '../../testing/configurations';
import { processParPostRequest } from '../../testing/par';
import { processAuthorizationGetRequest } from '../../testing/authorization';
import { createAuthorizationFailRequest } from '../../testing/authorizationFail';

describe('AuthorizationFailHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const requestUri = await processParPostRequest();
    const ticket = await processAuthorizationGetRequest(requestUri);

    const request = createAuthorizationFailRequest(ticket);
    const response = await authorizationFailHandlerConfiguration.handle(
      request
    );

    expect(response.status).toBe(302);
    expect(
      response.headers
        .get('Location')
        ?.startsWith('eudi-openid4ci://authorize/?error=login_require')
    ).toBe(true);
  }, 10000);
});
