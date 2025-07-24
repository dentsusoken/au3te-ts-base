import { describe, it, expect } from 'vitest';
import { TokenCreateResponse } from '@vecrea/au3te-ts-common/schemas.token-create';
import {
  createProcessApiResponse,
  buildOkMessage,
} from '../processApiResponse';
import { defaultResponseFactory } from '../../core/responseFactory';
import { createResponseErrorFactory } from '../../core/responseErrorFactory';
import { ResponseError } from '../../core/ResponseError';

describe('processApiResponse', () => {
  const path = '/token';
  const mockBuildUnknownActionMessage = (path: string, action: string) =>
    `${path}: Unknown action: ${action}`;

  const responseErrorFactory = createResponseErrorFactory(
    defaultResponseFactory
  );

  const processApiResponse = createProcessApiResponse({
    path,
    responseFactory: defaultResponseFactory,
    responseErrorFactory,
    buildUnknownActionMessage: mockBuildUnknownActionMessage,
  });

  describe('createProcessApiResponse', () => {
    it('should handle INTERNAL_SERVER_ERROR action', async () => {
      const apiResponse = {
        action: 'INTERNAL_SERVER_ERROR',
      } as TokenCreateResponse;
      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError(
          '{\n  "action": "INTERNAL_SERVER_ERROR"\n}',
          expect.any(Response)
        )
      );
    });

    it('should handle BAD_REQUEST action', async () => {
      const apiResponse = {
        action: 'BAD_REQUEST',
      } as TokenCreateResponse;
      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError(
          '{\n  "action": "BAD_REQUEST"\n}',
          expect.any(Response)
        )
      );
    });

    it('should handle FORBIDDEN action', async () => {
      const apiResponse = {
        action: 'FORBIDDEN',
      } as TokenCreateResponse;
      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError('{\n  "action": "FORBIDDEN"\n}', expect.any(Response))
      );
    });

    it('should handle OK action with JWT access token', async () => {
      const apiResponse = {
        action: 'OK',
        jwtAccessToken: 'jwt.access.token',
        accessToken: 'access_token',
        expiresIn: 3600,
        scopes: ['scope1', 'scope2'],
        refreshToken: 'refresh_token',
      } as TokenCreateResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(200);
      const responseBody = JSON.parse(await response.text());
      expect(responseBody).toEqual({
        access_token: 'jwt.access.token',
        issued_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'scope1 scope2',
        refresh_token: 'refresh_token',
      });
    });

    it('should handle OK action with regular access token', async () => {
      const apiResponse = {
        action: 'OK',
        accessToken: 'access_token',
        expiresIn: 3600,
        scopes: ['scope1'],
        refreshToken: 'refresh_token',
      } as TokenCreateResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(200);
      const responseBody = JSON.parse(await response.text());
      expect(responseBody).toEqual({
        access_token: 'access_token',
        issued_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'scope1',
        refresh_token: 'refresh_token',
      });
    });

    it('should handle OK action with empty scopes', async () => {
      const apiResponse = {
        action: 'OK',
        accessToken: 'access_token',
        expiresIn: 3600,
        refreshToken: 'refresh_token',
      } as TokenCreateResponse;
      const response = await processApiResponse(apiResponse);
      expect(response.status).toBe(200);
      const responseBody = JSON.parse(await response.text());
      expect(responseBody.scope).toBe('');
    });

    it('should handle unknown action', async () => {
      const apiResponse = {
        action: 'UNKNOWN_ACTION',
      } as unknown as TokenCreateResponse;
      await expect(processApiResponse(apiResponse)).rejects.toThrow(
        new ResponseError(
          '/token: Unknown action: UNKNOWN_ACTION',
          expect.any(Response)
        )
      );
    });
  });

  describe('buildOkMessage', () => {
    it('should build correct message with all fields', () => {
      const apiResponse = {
        jwtAccessToken: 'jwt.access.token',
        accessToken: 'access_token',
        expiresIn: 3600,
        scopes: ['scope1', 'scope2'],
        refreshToken: 'refresh_token',
      } as TokenCreateResponse;

      const message = JSON.parse(buildOkMessage(apiResponse));
      expect(message).toEqual({
        access_token: 'jwt.access.token',
        issued_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'scope1 scope2',
        refresh_token: 'refresh_token',
      });
    });
  });
});
