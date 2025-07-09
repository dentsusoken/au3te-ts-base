import { describe, it, expect, vi } from 'vitest';
import { AuthorizationHandlerConfigurationImpl } from '../AuthorizationHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../../BaseHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { SessionSchemas } from '../../../session/types';
import { AuthorizationIssueHandlerConfiguration } from '../../authorization-issue/AuthorizationIssueHandlerConfiguration';
import { AuthorizationFailHandlerConfiguration } from '../../authorization-fail/AuthorizationFailHandlerConfiguration';
import { AuthorizationPageHandlerConfiguration } from '@vecrea/au3te-ts-common/handler.authorization-page';
import { ExtractorConfiguration } from '../../../extractor/ExtractorConfiguration';

describe('AuthorizationHandlerConfigurationImpl', () => {
  // Mock API client
  const mockApiClient = {
    authorizationPath: '/api/auth/authorization',
  } as ApiClient;

  // Use SessionSchemas as the type parameter
  const mockBaseConfig = {
    apiClient: mockApiClient,
  } as unknown as BaseHandlerConfiguration<SessionSchemas>;

  const mockAuthorizationIssueConfig = {
    handle: vi.fn(),
  } as unknown as AuthorizationIssueHandlerConfiguration;

  const mockAuthorizationFailConfig = {
    handle: vi.fn(),
  } as unknown as AuthorizationFailHandlerConfiguration;

  const mockAuthorizationPageModelConfig = {
    buildAuthorizationPageModel: vi.fn(),
  } as unknown as AuthorizationPageHandlerConfiguration;

  const mockExtractorConfig = {
    extractParameters: vi.fn(),
  } as unknown as ExtractorConfiguration;

  it('should initialize with all required properties', () => {
    const config = new AuthorizationHandlerConfigurationImpl({
      baseHandlerConfiguration: mockBaseConfig,
      authorizationIssueHandlerConfiguration: mockAuthorizationIssueConfig,
      authorizationFailHandlerConfiguration: mockAuthorizationFailConfig,
      authorizationPageHandlerConfiguration: mockAuthorizationPageModelConfig,
      extractorConfiguration: mockExtractorConfig,
    });

    expect(config.path).toBe('/api/authorization');
    expect(config.processApiRequest).toBeDefined();
    expect(config.responseToDecisionParams).toBeDefined();
    expect(config.checkPrompts).toBeDefined();
    expect(config.checkAuthAge).toBeDefined();
    expect(config.clearCurrentUserInfoInSession).toBeDefined();
    expect(config.clearCurrentUserInfoInSessionIfNecessary).toBeDefined();
    expect(config.buildResponse).toBeDefined();
    expect(config.generateAuthorizationPage).toBeDefined();
    expect(config.checkSubject).toBeDefined();
    expect(config.calcSub).toBeDefined();
    expect(config.handleNoInteraction).toBeDefined();
    expect(config.processApiResponse).toBeDefined();
    expect(config.handle).toBeDefined();
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
  });
});
