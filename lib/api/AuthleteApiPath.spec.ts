import { describe, it, expect } from 'vitest';
import { pushedAuthReqPath } from './authleteApiPath';

describe('API path functions', () => {
  const serviceId = '123';

  it('should generate the correct pushedAuthReqPath', () => {
    expect(pushedAuthReqPath(serviceId)).toBe('/api/123/pushed_auth_req');
  });
});
