import { AuthorizationFailRequest } from '@vecrea/au3te-ts-common/schemas.authorization-fail';

export const createAuthorizationFailRequest = (ticket: string) => {
  const request: AuthorizationFailRequest = {
    reason: 'NOT_LOGGED_IN',
    ticket,
  };

  return request;
};
