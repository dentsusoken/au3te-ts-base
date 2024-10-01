import { describe, it, expect } from 'vitest';
import {
  pushedAuthReqPath,
  authorizationPath,
  authorizationFailPath,
  authorizationIssuePath,
} from './apiPath';

describe('API path functions', () => {
  const serviceId = '123';

  it('should generate the correct pushedAuthReqPath', () => {
    expect(pushedAuthReqPath(serviceId)).toBe('/api/123/pushed_auth_req');
  });

  it('should generate the correct authorizationPath', () => {
    expect(authorizationPath(serviceId)).toBe('/api/123/auth/authorization');
  });

  it('should generate the correct authorizationFailPath', () => {
    expect(authorizationFailPath(serviceId)).toBe(
      '/api/123/auth/authorization/fail'
    );
  });

  it('should generate the correct authorizationIssuePath', () => {
    expect(authorizationIssuePath(serviceId)).toBe(
      '/api/123/auth/authorization/issue'
    );
  });
});
