import { describe, it, expect } from 'vitest';
import { introspectionHandlerConfiguration } from '@/testing/configurations';
import { processParPostRequest } from '@/testing/par';
import { processAuthorizationGetRequest } from '@/testing/authorization';
import { processAuthorizationDecisionPostRequest } from '@/testing/authorizationDecision';
import { processTokenPostRequest } from '@/testing/token';
import { createIntrospectionRequest } from '@/testing/introspection';

describe('IntrospectionHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);
    const code = await processAuthorizationDecisionPostRequest();
    const accessToken = await processTokenPostRequest(code);

    const request = createIntrospectionRequest(accessToken);
    const response =
      await introspectionHandlerConfiguration.processApiRequestWithValidation(
        request
      );

    expect(response.action).toBe('OK');
  }, 10000);
});
