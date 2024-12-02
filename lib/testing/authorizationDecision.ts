import { authorizationDecisionHandlerConfiguration } from './configurations';

export const createAuthorizationDecisionParameters = () => {
  return new URLSearchParams({
    authorized: 'true',
    loginId: 'inga',
    password: 'inga',
  }).toString();
};

export const createAuthorizationDecisionGetRequest = () => {
  const request = new Request(
    `http://localhost/authorize/decision?${createAuthorizationDecisionParameters()}`,
    {
      method: 'GET',
    }
  );
  return request;
};

export const createAuthorizationDecisionPostRequest = () => {
  const request = new Request('http://localhost/authorize/decision', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: createAuthorizationDecisionParameters(),
  });
  return request;
};

export const processAuthorizationDecisionPostRequest = async () => {
  const request = createAuthorizationDecisionPostRequest();
  const response =
    await authorizationDecisionHandlerConfiguration.processRequest(request);
  const locationHeader = response.headers.get('Location');
  const code = new URL(locationHeader!).searchParams.get('code')!;

  return code;
};
