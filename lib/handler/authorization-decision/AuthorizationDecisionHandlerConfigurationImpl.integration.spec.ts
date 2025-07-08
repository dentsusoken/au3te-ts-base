import { describe, it, expect } from 'vitest';
import { authorizationDecisionHandlerConfiguration } from '../../testing/configurations';
import { processParPostRequest } from '../../testing/par';
import { processAuthorizationGetRequest } from '../../testing/authorization';
import {
  createAuthorizationDecisionGetRequest,
  createAuthorizationDecisionPostRequest,
} from '../../testing/authorizationDecision';

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
    expect(locationHeader?.startsWith('eudi-openid4ci://authorize/?')).toBe(
      true
    );
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
    expect(locationHeader?.startsWith('eudi-openid4ci://authorize/?')).toBe(
      true
    );
  }, 10000);
});
