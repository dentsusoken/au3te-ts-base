import { AuthorizationIssueRequest } from '@vecrea/au3te-ts-common/schemas.authorization-issue';

export const createAuthorizationIssueRequest = (ticket: string) => {
  const request: AuthorizationIssueRequest = {
    ticket,
    subject: '1004',
  };

  return request;
};
