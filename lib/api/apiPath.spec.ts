import { describe, it, expect } from 'vitest';
import {
  pushedAuthReqPath,
  authorizationPath,
  authorizationFailPath,
  authorizationIssuePath,
  tokenPath,
  tokenIssuePath,
  tokenFailPath,
  tokenCreatePath,
  introspectionPath,
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

  it('should generate the correct tokenPath', () => {
    expect(tokenPath(serviceId)).toBe('/api/123/auth/token');
  });

  it('should generate the correct tokenIssuePath', () => {
    expect(tokenIssuePath(serviceId)).toBe('/api/123/auth/token/issue');
  });

  it('should generate the correct tokenFailPath', () => {
    expect(tokenFailPath(serviceId)).toBe('/api/123/auth/token/fail');
  });

  it('should generate the correct tokenCreatePath', () => {
    expect(tokenCreatePath(serviceId)).toBe('/api/123/auth/token/create');
  });

  describe('introspectionPath', () => {
    it('should generate the correct introspection API path', () => {
      const serviceId = '1234567890';
      const expected = '/api/1234567890/auth/introspection';
      const actual = introspectionPath(serviceId);
      expect(actual).toBe(expected);
    });

    it('should handle numeric service IDs', () => {
      const serviceId = '123';
      const expected = '/api/123/auth/introspection';
      const actual = introspectionPath(serviceId);
      expect(actual).toBe(expected);
    });
  });
});
