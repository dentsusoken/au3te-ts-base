import { CredentialSingleParseRequest } from '@vecrea/au3te-ts-common/schemas.credential-single-parse';

export const createCredentialSingleParseRequest = (accessToken: string) => {
  const request: CredentialSingleParseRequest = {
    accessToken,
    requestContent: JSON.stringify({
      format: 'mso_mdoc',
      doctype: 'org.iso.18013.5.1.mDL',
      claims: {
        'org.iso.18013.5.1': {
          family_name: {},
          given_name: {},
          birth_date: {},
          issue_date: {},
          expiry_date: {},
          issuing_country: {},
          document_number: {},
          driving_privileges: {},
        },
      },
    }),
  };

  return request;
};
