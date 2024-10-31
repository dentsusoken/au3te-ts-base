import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { sessionSchemas } from '../../session/sessionSchemas';
import { InMemorySession } from '../../session/InMemorySession';
import { BaseHandlerConfigurationImpl } from '../BaseHandlerConfigurationImpl';
import { CredentialMetadataHandlerConfigurationImpl } from './CredentialMetadataHandlerConfigurationImpl';
import { CredentialIssuerMetadataRequest } from 'au3te-ts-common/schemas.credential-metadata';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};

const apiClient = new ApiClientImpl(configuration);
const session = new InMemorySession(sessionSchemas);
const baseHandlerConfiguration = new BaseHandlerConfigurationImpl(
  apiClient,
  session
);
const config = new CredentialMetadataHandlerConfigurationImpl(
  baseHandlerConfiguration
);

const testCredentialIssuerMetadata = async () => {
  const request: CredentialIssuerMetadataRequest = {
    pretty: true,
  };

  const response = await config.handle(request);
  const responseBody = await response.json();
  //console.log(responseBody);

  expect(response.status).toBe(200);
  expect(responseBody.credential_issuer).toBeDefined();
};

describe('CredentialMetadataHandlerConfiguration.handle', () => {
  it('should successfully handle()', async () => {
    await testCredentialIssuerMetadata();
  }, 10000);
});
