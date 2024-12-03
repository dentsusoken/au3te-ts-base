/*
 * Copyright (C) 2024 Dentsusoken, Inc.
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

import { describe, it, expect } from 'vitest';
import { credentialSingleIssueHandlerConfiguration } from '../../testing/configurations';
import { processParPostRequest } from '../../testing/par';
import { processAuthorizationGetRequest } from '../../testing/authorization';
import { processAuthorizationDecisionPostRequest } from '../../testing/authorizationDecision';
import { processTokenPostRequest } from '../../testing/token';
import { createCredentialSingleIssuePostRequest } from '../../testing/credentialSingleIssue';

describe('CredentialSingleIssueHandlerConfigurationImpl Integration Tests', () => {
  it('should work with processRequest', async () => {
    // Arrange
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);
    const code = await processAuthorizationDecisionPostRequest();
    const accessToken = await processTokenPostRequest(code);
    const request = createCredentialSingleIssuePostRequest(accessToken);

    // Act
    const response =
      await credentialSingleIssueHandlerConfiguration.processRequest(request);
    console.log(response);
    const responseBody = await response.json();
    console.log(responseBody);
    // Assert
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(responseBody).toBeDefined();
    expect(responseBody.credential).toBeDefined();
    expect(responseBody.c_nonce).toBeDefined();
    expect(responseBody.c_nonce_expires_in).toBeDefined();
  }, 10000);
});
