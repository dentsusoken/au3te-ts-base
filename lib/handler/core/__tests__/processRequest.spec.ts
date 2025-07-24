import { describe, it, expect, vi, afterEach } from 'vitest';
import { createProcessRequest } from '../processRequest';
import { RecoverResponseResult } from '../recoverResponseResult';

describe('createProcessRequest', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should process request successfully', async () => {
    const mockToApiRequest = vi.fn().mockResolvedValue({ data: 'apiRequest' });
    const mockHandle = vi
      .fn()
      .mockResolvedValue(new Response('Success', { status: 200 }));
    const mockRecoverResponseResult: RecoverResponseResult = vi
      .fn()
      .mockImplementation((_, result) => Promise.resolve(result.value));

    const processRequest = createProcessRequest({
      path: '/test',
      toApiRequest: mockToApiRequest,
      handle: mockHandle,
      recoverResponseResult: mockRecoverResponseResult,
    });

    const mockRequest = new Request('http://example.com');

    const response = await processRequest(mockRequest);

    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockHandle).toHaveBeenCalledWith({ data: 'apiRequest' });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Success');
  });

  it('should handle errors and return internal server error', async () => {
    const errorMessage = 'API Request Error';
    const mockToApiRequest = vi.fn().mockRejectedValue(new Error(errorMessage));
    const mockHandle = vi.fn();
    const mockRecoverResponseResult: RecoverResponseResult = vi
      .fn()
      .mockResolvedValue(
        new Response('Internal Server Error', { status: 500 })
      );

    const processRequest = createProcessRequest({
      path: '/test',
      toApiRequest: mockToApiRequest,
      handle: mockHandle,
      recoverResponseResult: mockRecoverResponseResult,
    });

    const mockRequest = new Request('http://example.com');

    const response = await processRequest(mockRequest);

    expect(mockToApiRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockHandle).not.toHaveBeenCalled();
    expect(mockRecoverResponseResult).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Internal Server Error');
  });
});
