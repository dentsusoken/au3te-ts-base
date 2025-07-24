import { describe, it, expect } from 'vitest';
import { defaultDetermineSubject4JwtBearer } from '../determineSubject4JwtBearer';
import { TokenResponse } from '@vecrea/au3te-ts-common/schemas.token';
import { defaultResponseFactory } from '../../core/responseFactory';
import { createResponseErrorFactory } from '../../core/responseErrorFactory';

describe('defaultDetermineSubject4JwtBearer', () => {
  const responseErrorFactory = createResponseErrorFactory(
    defaultResponseFactory
  );

  // Test JWT with header: {"alg":"none"} and payload: {"sub":"test-subject"}
  const validJwt = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJ0ZXN0LXN1YmplY3QifQ.';

  it('should extract subject from valid JWT assertion', async () => {
    const response = {
      action: 'JWT_BEARER',
      assertion: validJwt,
    } as TokenResponse;

    const result = await defaultDetermineSubject4JwtBearer(
      response,
      responseErrorFactory
    );
    expect(result).toBe('test-subject');
  });

  it('should throw error when assertion is missing', async () => {
    const response = {
      action: 'JWT_BEARER',
    } as TokenResponse;

    await expect(
      defaultDetermineSubject4JwtBearer(response, responseErrorFactory)
    ).rejects.toThrow('Assertion is missing');
  });

  it('should throw error for invalid JWT format', async () => {
    const response = {
      action: 'JWT_BEARER',
      assertion: 'invalid-jwt',
    } as TokenResponse;

    await expect(
      defaultDetermineSubject4JwtBearer(response, responseErrorFactory)
    ).rejects.toThrow();
  });

  it('should throw error when JWT has no subject claim', async () => {
    // JWT with header: {"alg":"none"} and payload: {}
    const jwtWithoutSub = 'eyJhbGciOiJub25lIn0.e30.';
    const response = {
      action: 'JWT_BEARER',
      assertion: jwtWithoutSub,
    } as TokenResponse;

    await expect(
      defaultDetermineSubject4JwtBearer(response, responseErrorFactory)
    ).rejects.toThrow();
  });
});
