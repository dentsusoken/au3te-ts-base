import { describe, it, expect } from 'vitest';
import { AuthorizationIssueResponse } from '@vecrea/au3te-ts-common/schemas.authorization-issue';
import { createProcessApiResponse } from '../processApiResponse';

describe('createProcessApiResponse', () => {
  const path = '/path';
  const mockBuildUnknownActionMessage = (path: string, action: string) =>
    `${path}: Unknown action: ${action}`;
  const processApiResponse = createProcessApiResponse({
    path,
    buildUnknownActionMessage: mockBuildUnknownActionMessage,
  });

  it('should handle INTERNAL_SERVER_ERROR action', async () => {
    const apiResponse = {
      action: 'INTERNAL_SERVER_ERROR',
      responseContent: 'Internal server error content',
    } as AuthorizationIssueResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Internal server error content');
  });

  it('should handle BAD_REQUEST action', async () => {
    const apiResponse = {
      action: 'BAD_REQUEST',
      responseContent: 'Bad request content',
    } as AuthorizationIssueResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Bad request content');
  });

  it('should handle LOCATION action', async () => {
    const apiResponse = {
      action: 'LOCATION',
      responseContent: 'https://example.com/redirect',
    } as AuthorizationIssueResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe(
      'https://example.com/redirect'
    );
  });

  it('should handle FORM action', async () => {
    const apiResponse = {
      action: 'FORM',
      responseContent: '<form>...</form>',
    } as AuthorizationIssueResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe(
      'text/html;charset=utf-8'
    );
    expect(await response.text()).toBe('<form>...</form>');
  });

  it('should handle unknown action', async () => {
    const apiResponse = {
      action: 'UNKNOWN_ACTION',
    } as unknown as AuthorizationIssueResponse;
    const response = await processApiResponse(apiResponse);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('/path: Unknown action: UNKNOWN_ACTION');
  });
});
