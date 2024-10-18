import { describe, it, expect } from 'vitest';
import { createToApiRequest } from './toApiRequest';

describe('createToApiRequest', () => {
  const toApiRequest = createToApiRequest();

  it('should create a PushedAuthReqRequest from a Request', async () => {
    const mockRequest = new Request('http://localhost?pretty=true');

    const result = await toApiRequest(mockRequest);

    expect(result).toEqual({
      pretty: true,
    });
  });
});
