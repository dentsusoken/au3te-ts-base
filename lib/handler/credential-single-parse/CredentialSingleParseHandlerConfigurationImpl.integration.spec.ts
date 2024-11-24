import { describe, it, expect } from 'vitest';
import { setupIntegrationTest } from '../../testing/setupIntegrationTest';
import { ValidateCredentialSingleParseResponseOptions } from './validateApiResponse';

const {
  credentialSingleParseHandlerConfiguration,
  processParPostRequest,
  processAuthorizationGetRequest,
  processAuthorizationDecisionPostRequest,
  processTokenPostRequest,
  createCredentialSingleParseRequest,
} = setupIntegrationTest();

describe('CredentialSingleParseHandlerConfiguration Integration Tests', () => {
  it('should successfully handle API request', async () => {
    // Setup: Get an access token through the OAuth flow
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);
    const code = await processAuthorizationDecisionPostRequest();
    const accessToken = await processTokenPostRequest(code);

    // Test the credential single parse endpoint
    const options: ValidateCredentialSingleParseResponseOptions = {
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
