import { describe, it, expect } from 'vitest';
import { defaultToApiRequest } from '../toApiRequest';

describe('defaultToApiRequest', () => {
  const toApiRequest = defaultToApiRequest;

  it('should create a CredentialIssuerJwksRequest from a Request', async () => {
    const mockRequest = new Request('http://localhost?pretty=true');

    const result = await toApiRequest(mockRequest);

    expect(result).toEqual({
      pretty: true,
    });
  });
});
