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
  it('should work with toApiRequest', async () => {
    // Arrange
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);
    const code = await processAuthorizationDecisionPostRequest();
    const accessToken = await processTokenPostRequest(code);
    const request = createCredentialSingleIssuePostRequest(accessToken);

    // Act
    const apiRequestWithOptions =
      await credentialSingleIssueHandlerConfiguration.toApiRequest(request);
    //console.log(apiRequest);

    // Assert
    expect(apiRequestWithOptions).toBeDefined();
    const { apiRequest, options } = apiRequestWithOptions;
    expect(apiRequest).toBeDefined();
    expect(options).toBeDefined();
    expect(apiRequest.accessToken).toBeDefined();
    expect(apiRequest.order).toBeDefined();
    expect(options.accessToken).toBeDefined();
    expect(options.headers).toBeDefined();
  }, 10000);

  it('should work with processApiRequest', async () => {
    // Arrange
    const requestUri = await processParPostRequest();
    await processAuthorizationGetRequest(requestUri);
    const code = await processAuthorizationDecisionPostRequest();
    const accessToken = await processTokenPostRequest(code);
    const request = createCredentialSingleIssuePostRequest(accessToken);

    // Act
    const apiRequestWithOptions =
      await credentialSingleIssueHandlerConfiguration.toApiRequest(request);
    const apiResponse =
      await credentialSingleIssueHandlerConfiguration.processApiRequest(
        apiRequestWithOptions.apiRequest
      );
    console.log(apiResponse);

    // Assert
    expect(apiResponse).toBeDefined();
  }, 10000);
});
