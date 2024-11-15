import { describe, it, expect } from 'vitest';
import { TokenHandlerConfigurationImpl } from './TokenHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { ApiClient } from 'au3te-ts-common/api';
import { SessionSchemas } from '../../session/types';
import { UserConfiguration } from 'au3te-ts-common/user';
import { TokenFailHandlerConfiguration } from '../token-fail/TokenFailHandlerConfiguration';
import { TokenIssueHandlerConfiguration } from '../token-issue/TokenIssueHandlerConfiguration';
import { TokenCreateHandlerConfiguration } from '../token-create/TokenCreateHandlerConfiguration';

describe('TokenHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    tokenPath: '/token',
  } as unknown as ApiClient;

  // Mock base configuration
  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as unknown as BaseHandlerConfiguration<SessionSchemas>;

  // Mock user configuration
  const mockUserConfig = {
    getByCredentials: async () => ({ subject: 'test-subject' }),
  } as unknown as UserConfiguration;

  // Mock token fail configuration
  const mockTokenFailConfig = {
    buildTokenFailError: () => new Error('token fail'),
  } as unknown as TokenFailHandlerConfiguration;

  // Mock token issue configuration
  const mockTokenIssueConfig = {
    handle: async () => new Response(),
  } as unknown as TokenIssueHandlerConfiguration;

  // Mock token create configuration
  const mockTokenCreateConfig = {
    handle: async () => new Response(),
  } as unknown as TokenCreateHandlerConfiguration;

  it('should initialize with required properties', () => {
    const config = new TokenHandlerConfigurationImpl({
      baseHandlerConfiguration: mockBaseConfig,
      userConfiguration: mockUserConfig,
      tokenFailHandlerConfiguration: mockTokenFailConfig,
      tokenIssueHandlerConfiguration: mockTokenIssueConfig,
      tokenCreateHandlerConfiguration: mockTokenCreateConfig,
    });

    expect(config.path).toBe('/api/token');
    expect(config.processApiRequest).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.determineSubject4TokenExchange).toBeDefined();
    expect(config.determineSubject4JwtBearer).toBeDefined();
    expect(config.handlePassword).toBeDefined();
    expect(config.handleTokenExchange).toBeDefined();
    expect(config.handleJwtBearer).toBeDefined();
    expect(config.responseToCreateRequest4TokenExchange).toBeDefined();
    expect(config.responseToCreateRequest4JwtBearer).toBeDefined();
  });
});
