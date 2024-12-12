import { describe, it, expect } from 'vitest';
import { ServiceJwksResponse } from 'au3te-ts-common/schemas.service-jwks';
import { defaultProcessApiResponse } from './processApiResponse';

describe('defaultProcessApiResponse', () => {
  const processApiResponse = defaultProcessApiResponse;

  it('should handle response', async () => {
    const apiResponse = `{
      "keys": [
        {
          "kid": "1234567890",
          "kty": "RSA",
          "alg": "RS256",
          "use": "sig",
          "n": "01234567890",
          "e": "01234567890"
        }
      ]
    }` as ServiceJwksResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(200);
    expect(await response.text()).toStrictEqual(apiResponse);
  });
});
