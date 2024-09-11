import { describe, it, expect, vi } from 'vitest';
import { defaultProcessApiRequest } from './processApiRequest';
import { AuthleteApiFactory } from 'au3te-ts-common/api';
import {
  PushedAuthReqRequest,
  PushedAuthReqResponse,
} from 'au3te-ts-common/schemas.par';

vi.mock('au3te-ts-common/api', () => ({
  AuthleteApiFactory: {
    getDefaultApi: vi.fn(),
  },
}));

describe('defaultProcessApiRequest', () => {
  it('should call pushAuthorizationRequest with the provided apiRequest', async () => {
    const mockApiRequest = { parameters: 'value' } as PushedAuthReqRequest;
    const mockApiResponse = { action: 'CREATED' } as PushedAuthReqResponse;

    const mockPushAuthorizationRequest = vi
      .fn()
      .mockResolvedValue(mockApiResponse);

    vi.mocked(AuthleteApiFactory.getDefaultApi).mockReturnValue({
      pushAuthorizationRequest: mockPushAuthorizationRequest,
    });

    const result = await defaultProcessApiRequest(mockApiRequest);

    expect(AuthleteApiFactory.getDefaultApi).toHaveBeenCalled();

    expect(mockPushAuthorizationRequest).toHaveBeenCalledWith(mockApiRequest);

    expect(result).toEqual(mockApiResponse);
  });
});
