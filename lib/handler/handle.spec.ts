import { describe, it, expect, vi } from 'vitest';
import { createHandle } from './handle';

describe('createHandle', () => {
  const path = 'path';

  it('should process request and response successfully', async () => {
    const mockProcessApiRequest = vi
      .fn()
      .mockResolvedValue({ data: 'response data' });
    const mockProcessApiResponse = vi
      .fn()
      .mockResolvedValue(new Response('Success', { status: 200 }));
    const mockRecoverResponseResult = vi
      .fn()
      .mockImplementation(async (_, result) => result.value);

    const handle = createHandle({
      path,
      processApiRequest: mockProcessApiRequest,
      processApiResponse: mockProcessApiResponse,
      recoverResponseResult: mockRecoverResponseResult,
    });

    const apiRequest = { key: 'value' };
    const response = await handle(apiRequest);
    console.log('response:', response);

    expect(mockProcessApiRequest).toHaveBeenCalledWith(apiRequest);
    expect(mockProcessApiResponse).toHaveBeenCalledWith({
      data: 'response data',
    });
    expect(mockRecoverResponseResult).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Success');
  });

  it('should handle errors in processApiRequest', async () => {
    const mockProcessApiRequest = vi
      .fn()
      .mockRejectedValue(new Error('API request failed'));
    const mockProcessApiResponse = vi.fn();
    const mockRecoverResponseResult = vi
      .fn()
      .mockResolvedValue(new Response('Error', { status: 500 }));

    const handle = createHandle({
      path,
      processApiRequest: mockProcessApiRequest,
      processApiResponse: mockProcessApiResponse,
      recoverResponseResult: mockRecoverResponseResult,
    });

    const apiRequest = { key: 'value' };
    const response = await handle(apiRequest);

    expect(mockProcessApiRequest).toHaveBeenCalledWith(apiRequest);
    expect(mockProcessApiResponse).not.toHaveBeenCalled();
    expect(mockRecoverResponseResult).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Error');
  });

  it('should handle errors in processApiResponse', async () => {
    const mockProcessApiRequest = vi
      .fn()
      .mockResolvedValue({ data: 'response data' });
    const mockProcessApiResponse = vi
      .fn()
      .mockRejectedValue(new Error('API response processing failed'));
    const mockRecoverResponseResult = vi
      .fn()
      .mockResolvedValue(new Response('Error', { status: 500 }));

    const handle = createHandle({
      path,
      processApiRequest: mockProcessApiRequest,
      processApiResponse: mockProcessApiResponse,
      recoverResponseResult: mockRecoverResponseResult,
    });

    const apiRequest = { key: 'value' };
    const response = await handle(apiRequest);

    expect(mockProcessApiRequest).toHaveBeenCalledWith(apiRequest);
    expect(mockProcessApiResponse).toHaveBeenCalledWith({
      data: 'response data',
    });
    expect(mockRecoverResponseResult).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Error');
  });
});
