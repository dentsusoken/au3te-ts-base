import { describe, it, expect } from 'vitest';
import { tokenHandlerConfiguration } from '../../testing/configurations';
import { processParPostRequest } from '../../testing/par';
import { processAuthorizationGetRequest } from '../../testing/authorization';
import { processAuthorizationDecisionPostRequest } from '../../testing/authorizationDecision';
import {
  createTokenRequest,
  createTokenPostRequest,
} from '../../testing/token';

describe('TokenHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);
    const code = await processAuthorizationDecisionPostRequest();

    const request = createTokenRequest(code);
    const response = await tokenHandlerConfiguration.handle(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.access_token).toBeDefined();
  }, 10000);

  it('should successfully process HTTP request', async () => {
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);
    const code = await processAuthorizationDecisionPostRequest();

    const request = createTokenPostRequest(code);
    const response = await tokenHandlerConfiguration.processRequest(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.access_token).toBeDefined();
  }, 10000);
});
