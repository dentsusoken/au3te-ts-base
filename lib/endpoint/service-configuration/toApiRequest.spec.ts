import { describe, it, expect } from 'vitest';
import { defaultToApiRequest } from './toApiRequest';

describe('defaultToApiRequest', () => {
  const toApiRequest = defaultToApiRequest;

  it('should create a PushedAuthReqRequest from a Request', async () => {
    const mockRequest = new Request(
      'http://localhost?pretty=true&patch=%5B%7B%22op%22%3A%22replace%22%2C%22path%22%3A%22%2Fsubject_types_supported%22%2C%22value%22%3A%5B%22public%22%5D%7D%5D'
    );

    const result = await toApiRequest(mockRequest);

    expect(result).toEqual({
      pretty: true,
      patch:
        '[{"op":"replace","path":"/subject_types_supported","value":["public"]}]',
    });
  });
});
