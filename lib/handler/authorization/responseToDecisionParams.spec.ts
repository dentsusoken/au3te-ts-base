import { describe, it, expect } from 'vitest';
import { AuthorizationResponse } from 'au3te-ts-common/schemas.authorization';
import { AuthorizationDecisionParams } from 'au3te-ts-common/schemas.authorization-decision';
import { defaultResponseToDecisionParams } from './responseToDecisionParams';

describe('defaultResponseToDecisionParams', () => {
  it('should correctly transform AuthorizationResponse to AuthorizationDecisionParams', () => {
    const mockResponse: AuthorizationResponse = {
      action: 'INTERACTION',
      ticket: 'test-ticket',
      claims: ['claim1', 'claim2'],
      claimsLocales: ['en', 'ja'],
      idTokenClaims: 'id-token-claims',
      requestedClaimsForTx: ['tx-claim1', 'tx-claim2'],
      requestedVerifiedClaimsForTx: [
        { array: ['verified-claim1', 'verified-claim2'] },
      ],
    };

    const result = defaultResponseToDecisionParams(mockResponse);

    const expectedResult: AuthorizationDecisionParams = {
      ticket: 'test-ticket',
      claimNames: ['claim1', 'claim2'],
      claimLocales: ['en', 'ja'],
      idTokenClaims: 'id-token-claims',
      requestedClaimsForTx: ['tx-claim1', 'tx-claim2'],
      requestedVerifiedClaimsForTx: [
        { array: ['verified-claim1', 'verified-claim2'] },
      ],
    };

    expect(result).toEqual(expectedResult);
  });

  it('should handle undefined values', () => {
    const mockResponse: AuthorizationResponse = {
      action: 'INTERACTION',
      ticket: 'test-ticket',
    };

    const result = defaultResponseToDecisionParams(mockResponse);

    expect(result).toEqual({
      ticket: 'test-ticket',
      claimNames: undefined,
      claimLocales: undefined,
      idTokenClaims: undefined,
      requestedClaimsForTx: undefined,
      requestedVerifiedClaimsForTx: undefined,
    });
  });
});
