import { describe, expect, it } from 'vitest';
import { TokenEndpointConfigurationImpl } from './TokenEndpointConfigurationImpl';
import { BaseHandlerConfiguration } from '../../handler/BaseHandlerConfiguration';
import { ApiClient } from 'au3te-ts-common/api';
import { Session } from '../../session/Session';
import { sessionSchemas } from '../../session/sessionSchemas';
import { ExtractorConfigurationImpl } from '../../extractor/ExtractorConfigurationImpl';
import { UserConfiguration } from 'au3te-ts-common/user';
import { TokenFailHandlerConfiguration } from '../../handler/token-fail/TokenFailHandlerConfiguration';
import { TokenIssueHandlerConfiguration } from '../../handler/token-issue/TokenIssueHandlerConfiguration';
import { TokenCreateHandlerConfiguration } from '../../handler/token-create/TokenCreateHandlerConfiguration';

// Mock ApiClient and Session
const mockApiClient = {} as ApiClient;
const mockSession = {} as Session<typeof sessionSchemas>;

describe('TokenEndpointConfigurationImpl', () => {
  // Create mock configurations
  const baseHandlerConfiguration = {
    apiClient: mockApiClient,
    session: mockSession,
  } as BaseHandlerConfiguration<typeof sessionSchemas>;

  const extractorConfiguration = new ExtractorConfigurationImpl();

  const userConfiguration = {
    getByCredentials: async () => null,
  } as unknown as UserConfiguration;

  const tokenFailHandlerConfiguration = {
    buildTokenFailError: () => new Error(),
  } as unknown as TokenFailHandlerConfiguration;

  const tokenIssueHandlerConfiguration = {
    handle: async () => ({ type: 'ok', response: {} }),
  } as unknown as TokenIssueHandlerConfiguration;

  const tokenCreateHandlerConfiguration = {
    handle: async () => ({ type: 'ok', response: {} }),
  } as unknown as TokenCreateHandlerConfiguration;

  it('should initialize with required properties', () => {
    const config = new TokenEndpointConfigurationImpl({
      baseHandlerConfiguration,
      extractorConfiguration,
      userConfiguration,
      tokenFailHandlerConfiguration,
      tokenIssueHandlerConfiguration,
      tokenCreateHandlerConfiguration,
    });

    // Check if required properties are defined
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
  });
});
