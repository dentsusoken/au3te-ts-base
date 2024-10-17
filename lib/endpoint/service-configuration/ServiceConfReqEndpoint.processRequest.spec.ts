import { describe, it, expect } from 'vitest';
import { ApiClientImpl } from '../../api/ApiClientImpl';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { ServiceConfReqEndpoint } from './ServiceConfReqEndpoint';

const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};
const apiClient = new ApiClientImpl(configuration);
const endpoint = new ServiceConfReqEndpoint(apiClient);

const testPushAuthorizationRequest = async () => {
  const query = new URLSearchParams({
    pretty: 'true',
    patch:
      '[{"op":"replace","path":"/subject_types_supported","value":["public"]}]',
  }).toString();
  //console.log('body:', body);

  const request = new Request(`http://localhost?${query.toString()}`, {
    method: 'GET',
  });

  const response = await endpoint.processRequest(request);
  //console.log(response);
  const resBody = await response.text();
  console.log(resBody);

  expect(response.status).toBe(200);
  // expect(resBody.expires_in).toBeDefined();
  // expect(resBody.request_uri).toBeDefined();

  //return response;
};

describe('ServiceConfReqEndpoint.processRequest', () => {
  it('should successfully processRequest()', async () => {
    await testPushAuthorizationRequest();
  }, 10000);
});
