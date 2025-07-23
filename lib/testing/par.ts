import { PushedAuthReqRequest } from '@vecrea/au3te-ts-common/schemas.par';
import { parHandlerConfiguration } from './configurations';

const CLIENT_ID = process.env.CLIENT_ID!;

export const createParParameters = () => {
  return new URLSearchParams({
    scope: 'org.iso.18013.5.1.mDL',
    redirect_uri: 'eudi-openid4ci://authorize/',
    response_type: 'code',
    client_id: CLIENT_ID,
    state: '1234567890',
  }).toString();
};

export const createParRequest = () => {
  const request: PushedAuthReqRequest = {
    parameters: createParParameters(),
  };

  return request;
};

export const createParPostRequest = () => {
  const request = new Request('http://localhost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: createParParameters(),
  });

  return request;
};

export const processParPostRequest = async () => {
  const request = createParPostRequest();
  const response = await parHandlerConfiguration.processRequest(request);
  const body = await response.json();

  return body.request_uri!;
};
