import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { ServiceConfReqHandler } from './ServiceConfReqHandler';
import { ServiceConfigurationRequest } from 'au3te-ts-common/schemas.service.configuration';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};
const apiClient = new ApiClientImpl(configuration);
const handler = new ServiceConfReqHandler(apiClient);

const testServiceConfRequest = async () => {
  const request: ServiceConfigurationRequest = {
    pretty: true,
    patch:
      '[{"op":"replace","path":"/subject_types_supported","value":["public"]}]',
  };

  const response = await handler.handle(request);
  // console.log(response);
  const responseBody = await response.json();
  // console.log(responseBody);

  expect(response.status).toBe(200);
  expect(responseBody.issuer).toBeDefined();

  //return response;
};

describe('ServiceConfReqHandler.handle', () => {
  it('should successfully handle()', async () => {
    await testServiceConfRequest();
  }, 10000);
});
