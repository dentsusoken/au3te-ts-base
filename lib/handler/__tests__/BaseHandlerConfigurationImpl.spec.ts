import { describe, it, expect } from 'vitest';
import { CommonHandlerConfigurationImpl } from '@vecrea/au3te-ts-common/handler';
import { BaseHandlerConfigurationImpl } from '../BaseHandlerConfigurationImpl';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { Session } from '../../session/Session';
import { SessionSchemas } from '../../session/types';
import { defaultPrepareHeaders } from '../prepareHeaders';

// Mock ApiClient and Session
const mockApiClient = {
  pushAuthorizationRequestPath: 'pushAuthorizationRequestPath',
} as ApiClient;
const mockSession = {} as Session<SessionSchemas>;

describe('BaseHandlerConfigurationImpl', () => {
  // Test constructor
  it('should correctly initialize with provided ApiClient and Session', () => {
    const config = new BaseHandlerConfigurationImpl(mockApiClient, mockSession);

    // Check if apiClient and session are correctly set
    expect(config.apiClient).toBe(mockApiClient);
    expect(config.session).toBe(mockSession);
    expect(config.recoverResponseResult).toBeDefined();
    expect(config.prepareHeaders).toBe(defaultPrepareHeaders);
  });

  // Test inheritance
  it('should inherit from CommonHandlerConfigurationImpl', () => {
    const config = new BaseHandlerConfigurationImpl(mockApiClient, mockSession);

    // Check if it's an instance of CommonHandlerConfigurationImpl
    expect(config).toBeInstanceOf(CommonHandlerConfigurationImpl);
  });
});
