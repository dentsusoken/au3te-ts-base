import { describe, it, expect } from 'vitest';
import {
  defaultExtractClientCertificateAndPath,
  ClientCertificateAndPath,
} from '../extractClientCertificateAndPath';

describe('defaultExtractClientCertificateAndPath', () => {
  it('should return empty client certificate and path', async () => {
    const request = new Request('https://example.com');

    const result = await defaultExtractClientCertificateAndPath(request);

    const expectedResult: ClientCertificateAndPath = {
      clientCertificate: undefined,
      clientCertificatePath: undefined,
    };

    expect(result).toEqual(expectedResult);
  });

  it('should return a new object instance each time', async () => {
    const request1 = new Request('https://example.com');
    const request2 = new Request('https://example.com');

    const result1 = await defaultExtractClientCertificateAndPath(request1);
    const result2 = await defaultExtractClientCertificateAndPath(request2);

    expect(result1).toEqual(result2);
    expect(result1).not.toBe(result2);
  });

  it('should ignore any properties of the request object', async () => {
    const request = new Request('https://example.com', {
      headers: {
        'X-Client-Cert': 'some-certificate',
      },
    });

    const result = await defaultExtractClientCertificateAndPath(request);

    const expectedResult: ClientCertificateAndPath = {
      clientCertificate: undefined,
      clientCertificatePath: undefined,
    };

    expect(result).toEqual(expectedResult);
  });
});
