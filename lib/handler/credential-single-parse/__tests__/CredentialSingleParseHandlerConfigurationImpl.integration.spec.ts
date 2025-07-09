import { describe, it, expect } from 'vitest';
import { credentialSingleParseHandlerConfiguration } from '../../../testing/configurations';
import { processParPostRequest } from '../../../testing/par';
import { processAuthorizationGetRequest } from '../../../testing/authorization';
import { processAuthorizationDecisionPostRequest } from '../../../testing/authorizationDecision';
import { processTokenPostRequest } from '../../../testing/token';
import { createCredentialSingleParseRequest } from '../../../testing/credentialSingleParse';
import { CredentialApiOptions } from '../../credential/types';

describe('CredentialSingleParseHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    // Setup: Get an access token through the OAuth flow
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);
    const code = await processAuthorizationDecisionPostRequest();
    const accessToken = await processTokenPostRequest(code);

    // Test the credential single parse endpoint
    const options: CredentialApiOptions = {
      headers: {},
      accessToken,
    };
    const request = createCredentialSingleParseRequest(accessToken);
    const response =
      await credentialSingleParseHandlerConfiguration.processApiRequestWithValidation(
        request,
        options
      );

    // Verify the response
    expect(response.action).toBe('OK');
    expect(response.info).toBeDefined();
    expect(response.info?.identifier).toBeDefined();
    expect(response.info?.format).toBeDefined();
    expect(response.info?.details).toBeDefined();
  }, 10000);
});
