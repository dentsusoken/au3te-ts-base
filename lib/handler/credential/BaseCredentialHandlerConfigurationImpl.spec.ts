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

import { describe, expect, it, vi } from 'vitest';
import { BaseCredentialHandlerConfigurationImpl } from './BaseCredentialHandlerConfigurationImpl';
import { CredentialMetadataHandlerConfiguration } from '../credential-metadata/CredentialMetadataHandlerConfiguration';

describe('BaseCredentialHandlerConfigurationImpl', () => {
  it('should properly initialize with credential metadata handler configuration', () => {
    // Arrange
    const mockProcessApiRequestWithValidation = vi.fn();
    const mockCredentialMetadataHandlerConfiguration = {
      processApiRequestWithValidation: mockProcessApiRequestWithValidation,
    } as unknown as CredentialMetadataHandlerConfiguration;

    // Act
    const config = new BaseCredentialHandlerConfigurationImpl({
      credentialMetadataHandlerConfiguration:
        mockCredentialMetadataHandlerConfiguration,
    });

    // Assert
    expect(config).toBeInstanceOf(BaseCredentialHandlerConfigurationImpl);
    expect(config.computeHtu).toBeTypeOf('function');
  });
});
