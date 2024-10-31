import { describe, it, expect, vi } from 'vitest';
import { AuthorizationHandlerConfigurationImpl } from './AuthorizationHandlerConfigurationImpl';
import { BaseHandlerConfiguration } from '../BaseHandlerConfiguration';
import { AuthorizationIssueHandlerConfiguration } from '../authorization-issue/AuthorizationIssueHandlerConfiguration';
import { AuthorizationFailHandlerConfiguration } from '../authorization-fail/AuthorizationFailHandlerConfiguration';
import { AuthorizationPageModelConfiguration } from 'au3te-ts-common/page-model.authorization';
import { SessionSchemas } from '../../session/types';
import { ApiClient } from 'au3te-ts-common/api';
import { Session } from '../../session/Session';
import { sessionSchemas } from '../../session/sessionSchemas';

const baseHandlerConfiguration = {
  apiClient: {
    authorizationPath: '/api/auth/authorization',
  } as ApiClient,
  session: {} as Session<SessionSchemas>,
  buildUnknownActionMessage: vi.fn(),
  recoverResponseResult: vi.fn(),
} as unknown as BaseHandlerConfiguration<typeof sessionSchemas>;

const authorizationIssueHandlerConfiguration = {
  handle: vi.fn(),
} as unknown as AuthorizationIssueHandlerConfiguration;

const authorizationFailHandlerConfiguration = {
  handle: vi.fn(),
} as unknown as AuthorizationFailHandlerConfiguration;

const authorizationPageModelConfiguration = {
  buildAuthorizationPageModel: vi.fn(),
} as unknown as AuthorizationPageModelConfiguration;

describe('AuthorizationHandlerConfigurationImpl', () => {
  const instance = new AuthorizationHandlerConfigurationImpl({
    baseHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
    authorizationPageModelConfiguration,
  });

  it('should have path property with correct value', () => {
    expect(instance.path).toBe('/api/auth/authorization');
  });

  it('should have processApiRequest property', () => {
    expect(instance.processApiRequest).toBeDefined();
  });

  it('should have responseToDecisionParams property', () => {
    expect(instance.responseToDecisionParams).toBeDefined();
  });

  it('should have checkPrompts property', () => {
    expect(instance.checkPrompts).toBeDefined();
  });

  it('should have checkAuthAge property', () => {
    expect(instance.checkAuthAge).toBeDefined();
  });

  it('should have clearCurrentUserInfoInSession property', () => {
    expect(instance.clearCurrentUserInfoInSession).toBeDefined();
  });

  it('should have clearCurrentUserInfoInSessionIfNecessary property', () => {
    expect(instance.clearCurrentUserInfoInSessionIfNecessary).toBeDefined();
  });

  it('should have buildResponse property', () => {
    expect(instance.buildResponse).toBeDefined();
  });

  it('should have generateAuthorizationPage property', () => {
    expect(instance.generateAuthorizationPage).toBeDefined();
  });

  it('should have checkSubject property', () => {
    expect(instance.checkSubject).toBeDefined();
  });

  it('should have calcSub property', () => {
    expect(instance.calcSub).toBeDefined();
  });

  it('should have buildAuthorizationFailError property', () => {
    expect(instance.buildAuthorizationFailError).toBeDefined();
  });

  it('should have handleNoInteraction property', () => {
    expect(instance.handleNoInteraction).toBeDefined();
  });

  it('should have processApiResponse property', () => {
    expect(instance.processApiResponse).toBeDefined();
  });

  it('should have handle property', () => {
    expect(instance.handle).toBeDefined();
  });
});
