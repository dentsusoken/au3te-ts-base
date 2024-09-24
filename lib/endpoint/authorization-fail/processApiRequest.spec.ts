import { describe, it, expect, vi, afterEach } from 'vitest';
import { defaultProcessApiRequest } from './processApiRequest';
import { AuthleteApiFactory, AuthleteApi } from 'au3te-ts-common/api';
import {
  AuthorizationFailRequest,
  AuthorizationFailResponse,
} from 'au3te-ts-common/schemas.authorization.fail';

describe('defaultProcessApiRequest', () => {
  afterEach(() => {
    AuthleteApiFactory.registerDefaultApi(undefined as unknown as AuthleteApi);
  });

  it('should call authorizationFail with the provided apiRequest', async () => {
    const mockApiRequest: AuthorizationFailRequest = {
      reason: 'NOT_LOGGED_IN',
      ticket: 'dummy-ticket',
    };
    const mockApiResponse: AuthorizationFailResponse = {
      action: 'LOCATION',
      responseContent: 'https://example.com/error',
      resultCode: 'A000000',
      resultMessage: 'success',
    };

    const mockAuthorizationFail = vi.fn().mockResolvedValue(mockApiResponse);
    const mockAuthleteApi = {
      authorizationFail: mockAuthorizationFail,
      authorization: vi.fn(),
      pushAuthorizationRequest: vi.fn(),
    } as AuthleteApi;
    AuthleteApiFactory.registerDefaultApi(mockAuthleteApi);

    const result = await defaultProcessApiRequest(mockApiRequest);

    expect(mockAuthorizationFail).toHaveBeenCalledWith(mockApiRequest);
    expect(result).toEqual(mockApiResponse);
  });

  it('should throw an error if authorizationFail fails', async () => {
    const mockApiRequest: AuthorizationFailRequest = {
      reason: 'NOT_LOGGED_IN',
      ticket: 'dummy-ticket',
    };
    const mockError = new Error('API call failed');

    const mockAuthorizationFail = vi.fn().mockRejectedValue(mockError);
    const mockAuthleteApi = {
      authorizationFail: mockAuthorizationFail,
      authorization: vi.fn(),
      pushAuthorizationRequest: vi.fn(),
    } as AuthleteApi;
    AuthleteApiFactory.registerDefaultApi(mockAuthleteApi);

    await expect(defaultProcessApiRequest(mockApiRequest)).rejects.toThrow(
      'API call failed'
    );
  });
});
