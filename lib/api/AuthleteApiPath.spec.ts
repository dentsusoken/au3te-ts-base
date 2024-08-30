import { describe, it, expect } from 'vitest';
import {
  authAuthorizationPath,
  authAuthorizationFailPath,
  pushedAuthReqPath,
  authAuthorizationIssuePath,
  authTokenPath,
  authIntrospectionPath,
  vciSingleParsePath,
  vciSingleIssuePath,
  serviceConfigurationPath,
  vciMetadataPath,
} from './AuthleteApiPath';

describe('API path functions', () => {
  const serviceId = '123';

  it('should generate the correct authAuthorizationPath', () => {
    expect(authAuthorizationPath(serviceId)).toBe(
      '/api/123/auth/authorization'
    );
  });

  it('should generate the correct authAuthorizationFailPath', () => {
    expect(authAuthorizationFailPath(serviceId)).toBe(
      '/api/123/auth/authorization/fail'
    );
  });

  it('should generate the correct pushedAuthReqPath', () => {
    expect(pushedAuthReqPath(serviceId)).toBe('/api/123/pushed_auth_req');
  });

  it('should generate the correct authAuthorizationIssuePath', () => {
    expect(authAuthorizationIssuePath(serviceId)).toBe(
      '/api/123/auth/authorization/issue'
    );
  });

  it('should generate the correct authTokenPath', () => {
    expect(authTokenPath(serviceId)).toBe('/api/123/auth/token');
  });

  it('should generate the correct authIntrospectionPath', () => {
    expect(authIntrospectionPath(serviceId)).toBe(
      '/api/123/auth/introspection'
    );
  });

  it('should generate the correct vciSingleParsePath', () => {
    expect(vciSingleParsePath(serviceId)).toBe('/api/123/vci/single/parse');
  });

  it('should generate the correct vciSingleIssuePath', () => {
    expect(vciSingleIssuePath(serviceId)).toBe('/api/123/vci/single/issue');
  });

  it('should generate the correct serviceConfigurationPath', () => {
    expect(serviceConfigurationPath(serviceId)).toBe(
      '/api/123/service/configuration'
    );
  });

  it('should generate the correct vciMetadataPath', () => {
    expect(vciMetadataPath(serviceId)).toBe('/api/123/vci/metadata');
  });
});
