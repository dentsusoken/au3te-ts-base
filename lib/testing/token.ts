import { TokenRequest } from '@vecrea/au3te-ts-common/schemas.token';
import { tokenHandlerConfiguration } from './configurations';

export const createTokenRequest = (code: string) => {
  const request: TokenRequest = {
    parameters: new URLSearchParams({
      code,
      redirect_uri: 'eudi-openid4ci://authorize/',
      grant_type: 'authorization_code',
      client_id: 'tw24.wallet.dentsusoken.com',
    }).toString(),
  };

  return request;
};

export const createTokenPostRequest = (code: string) => {
  const formData = new URLSearchParams({
    code,
    redirect_uri: 'eudi-openid4ci://authorize/',
    grant_type: 'authorization_code',
    client_id: 'tw24.wallet.dentsusoken.com',
  });

  const request = new Request('http://localhost/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  return request;
};

export const processTokenPostRequest = async (code: string) => {
  const request = createTokenPostRequest(code);
  const response = await tokenHandlerConfiguration.processRequest(request);
  const body = await response.json();

  return body.access_token!;
};
