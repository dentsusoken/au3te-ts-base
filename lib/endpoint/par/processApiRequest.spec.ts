import { describe, it, expect, vi, afterEach } from 'vitest';
import { defaultProcessApiRequest } from './processApiRequest';
import { AuthleteApiFactory, AuthleteApi } from 'au3te-ts-common/api';
import {
  PushedAuthReqRequest,
  PushedAuthReqResponse,
} from 'au3te-ts-common/schemas.par';

describe('defaultProcessApiRequest', () => {
  afterEach(() => {
    AuthleteApiFactory.registerDefaultApi(undefined as unknown as AuthleteApi);
  });

  it('should call pushAuthorizationRequest with the provided apiRequest', async () => {
    const mockApiRequest = { parameters: 'value' } as PushedAuthReqRequest;
    const mockApiResponse = { action: 'CREATED' } as PushedAuthReqResponse;

    const mockPushAuthorizationRequest = vi
      .fn()
      .mockResolvedValue(mockApiResponse);
    const mockAuthleteApi = {
      pushAuthorizationRequest: mockPushAuthorizationRequest,
      authorization: vi.fn(),
    } as AuthleteApi;
    AuthleteApiFactory.registerDefaultApi(mockAuthleteApi);

    const result = await defaultProcessApiRequest(mockApiRequest);

    expect(mockPushAuthorizationRequest).toHaveBeenCalledWith(mockApiRequest);

    expect(result).toEqual(mockApiResponse);
  });
});
