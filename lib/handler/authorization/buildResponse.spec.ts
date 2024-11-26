import { describe, it, expect } from 'vitest';
import { simpleBuildResponse } from './buildResponse';
import { AuthorizationPageModel } from 'au3te-ts-common/handler.authorization-page';

describe('simpleBuildResponse', () => {
  it('should return a Response with JSON stringified AuthorizationPageModel', async () => {
    const model: AuthorizationPageModel = {
      authorizationResponse: {
        action: 'FORM',
      },
    };
    const response = await simpleBuildResponse(model);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(JSON.parse(await response.text())).toEqual(model);
  });
});
