import { describe, it, expect, vi } from 'vitest';
import { Result } from 'au3te-ts-common/utils';
import { ProcessError } from 'au3te-ts-common/handler';
import { createRecoverResponseResult } from './recoverResponseResult';

describe('createRecoverResponseResult', () => {
  const mockProcessError: ProcessError = vi.fn(
    async (e) => `Processed error: ${e.message}`
  );
  const recoverResponseResult = createRecoverResponseResult(mockProcessError);

  it('should return the original response when Result is Ok', async () => {
    const mockResponse = new Response('Success', { status: 200 });
    const result = Result.success(mockResponse);

    const response = await recoverResponseResult(result);

    expect(response).toBe(mockResponse);
    expect(mockProcessError).not.toHaveBeenCalled();
  });

  it('should process the error and return an internal server error response when Result is Err', async () => {
    const error = new Error('Test error');
    const result = Result.failure(error) as Result<Response>;

    const response = await recoverResponseResult(result);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Processed error: Test error');
    expect(mockProcessError).toHaveBeenCalledWith(error);
  });

  it('should return an internal server error with the error message if processError fails', async () => {
    const error = new Error('Test error');
    const result = Result.failure(error) as Result<Response>;
    vi.mocked(mockProcessError).mockRejectedValueOnce(
      new Error('Process error failed')
    );

    const response = await recoverResponseResult(result);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Process error failed');
    expect(mockProcessError).toHaveBeenCalledWith(error);
  });
});
