/*
 * Copyright (C) 2014-2024 Authlete, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the
 * License.
 */

import { describe, expect, it } from 'vitest';
import { AuthorizationDecisionHandlerConfigurationImpl } from '../AuthorizationDecisionHandlerConfigurationImpl';
import { ServerHandlerConfiguration } from '../../ServerHandlerConfiguration';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { Session } from '../../../session/Session';
import { sessionSchemas } from '../../../session/sessionSchemas';
import { ExtractorConfigurationImpl } from '../../../extractor/ExtractorConfigurationImpl';
import { UserHandlerConfiguration } from '@vecrea/au3te-ts-common/handler.user';
import { AuthorizationHandlerConfiguration } from '../../authorization';
import { AuthorizationIssueHandlerConfiguration } from '../../authorization-issue';
import { AuthorizationFailHandlerConfiguration } from '../../authorization-fail';
// Mock ApiClient and Session
const mockApiClient = {} as unknown as ApiClient;
const mockSession = {} as unknown as Session<typeof sessionSchemas>;
const mockUserHandlerConfiguration = {} as unknown as UserHandlerConfiguration;
const mockAuthorizationHandlerConfiguration = {
  buildAuthorizationFailError: () => {
    throw new Error();
  },
  calcSub: async () => '',
} as unknown as AuthorizationHandlerConfiguration<typeof sessionSchemas>;
const mockAuthorizationIssueHandlerConfiguration = {
  path: '/authorization/issue',
  handle: async () => new Response(),
} as unknown as AuthorizationIssueHandlerConfiguration;
const mockAuthorizationFailHandlerConfiguration = {
  buildAuthorizationFailError: () => {
    throw new Error();
  },
} as unknown as AuthorizationFailHandlerConfiguration;

describe('AuthorizationDecisionHandlerConfigurationImpl', () => {
  // Create a mock BaseHandlerConfiguration
  const serverHandlerConfiguration = {
    apiClient: mockApiClient,
    session: mockSession,
    recoverResponseResult: async () => new Response(),
  } as unknown as ServerHandlerConfiguration<typeof sessionSchemas>;

  // Create ExtractorConfiguration instance
  const extractorConfiguration = new ExtractorConfigurationImpl();

  it('should initialize with required properties', () => {
    const config = new AuthorizationDecisionHandlerConfigurationImpl({
      serverHandlerConfiguration: serverHandlerConfiguration,
      extractorConfiguration,
      userHandlerConfiguration: mockUserHandlerConfiguration,
      authorizationHandlerConfiguration: mockAuthorizationHandlerConfiguration,
      authorizationIssueHandlerConfiguration:
        mockAuthorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration:
        mockAuthorizationFailHandlerConfiguration,
    });

    // Check if required properties are defined
    expect(config.path).toBe('/api/authorization/decision');
    expect(config.toApiRequest).toBeDefined();
    expect(config.processRequest).toBeDefined();
    expect(config.collectClaims).toBeDefined();
    expect(config.getOrAuthenticateUser).toBeDefined();
  });
});
