import { IntrospectionRequest } from '@vecrea/au3te-ts-common/schemas.introspection';

export const createIntrospectionRequest = (accessToken: string) => {
  const request: IntrospectionRequest = {
    token: accessToken,
  };

  return request;
};
