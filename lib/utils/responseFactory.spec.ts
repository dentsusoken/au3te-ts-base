import { describe, it, expect } from 'vitest';
import {
  createResponse,
  ok,
  created,
  noContent,
  location,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  tooLarge,
  internalServerError,
} from './responseFactory';
import { HttpStatus, MediaType, getStatusText } from 'au3te-ts-common/utils';

describe('Response creation functions', () => {
  describe('createResponse', () => {
    it('should create a response with correct status, statusText, and headers', async () => {
      const response = createResponse(
        HttpStatus.OK,
        MediaType.APPLICATION_JSON_UTF8,
        '{"key":"value"}',
        { 'Custom-Header': 'Value' }
      );
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.statusText).toBe(getStatusText(HttpStatus.OK));
      expect(await response.json()).toEqual({ key: 'value' });
      expect(response.headers.get('Content-Type')).toBe(
        MediaType.APPLICATION_JSON_UTF8
      );
      expect(response.headers.get('Custom-Header')).toBe('Value');
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.headers.get('Pragma')).toBe('no-cache');
    });

    it('should not include Content-Type if not provided', () => {
      const response = createResponse(
        HttpStatus.NO_CONTENT,
        undefined,
        undefined
      );
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
      expect(response.statusText).toBe(getStatusText(HttpStatus.NO_CONTENT));
      expect(response.headers.get('Content-Type')).toBeNull();
    });
  });

  describe('ok', () => {
    it('should create a 200 OK response', async () => {
      const response = ok('{"success":true}');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.statusText).toBe(getStatusText(HttpStatus.OK));
      expect(await response.json()).toEqual({ success: true });
      expect(response.headers.get('Content-Type')).toBe(
        MediaType.APPLICATION_JSON_UTF8
      );
    });
  });

  describe('created', () => {
    it('should create a 201 Created response', async () => {
      const response = created('{"id":1}');
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.statusText).toBe(getStatusText(HttpStatus.CREATED));
      expect(await response.json()).toEqual({ id: 1 });
      expect(response.headers.get('Content-Type')).toBe(
        MediaType.APPLICATION_JSON_UTF8
      );
    });
  });

  describe('noContent', () => {
    it('should create a 204 No Content response', async () => {
      const response = noContent();
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
      expect(response.statusText).toBe(getStatusText(HttpStatus.NO_CONTENT));
      expect(await response.text()).toBe('');
      expect(response.headers.get('Content-Type')).toBeNull();
    });
  });

  describe('location', () => {
    it('should create a 302 Found response with Location header', () => {
      const response = location('/new-location');
      expect(response.status).toBe(HttpStatus.FOUND);
      expect(response.statusText).toBe(getStatusText(HttpStatus.FOUND));
      expect(response.headers.get('Location')).toBe('/new-location');
    });
  });

  describe('badRequest', () => {
    it('should create a 400 Bad Request response', async () => {
      const response = badRequest('{"error":"Invalid input"}');
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.statusText).toBe(getStatusText(HttpStatus.BAD_REQUEST));
      expect(await response.json()).toEqual({ error: 'Invalid input' });
      expect(response.headers.get('Content-Type')).toBe(
        MediaType.APPLICATION_JSON_UTF8
      );
    });
  });

  describe('unauthorized', () => {
    it('should create a 401 Unauthorized response with WWW-Authenticate header', async () => {
      const response = unauthorized(
        '{"error":"Unauthorized"}',
        'Basic realm="example"'
      );
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.statusText).toBe(getStatusText(HttpStatus.UNAUTHORIZED));
      expect(await response.json()).toEqual({ error: 'Unauthorized' });
      expect(response.headers.get('Content-Type')).toBe(
        MediaType.APPLICATION_JSON_UTF8
      );
      expect(response.headers.get('WWW-Authenticate')).toBe(
        'Basic realm="example"'
      );
    });
  });

  describe('forbidden', () => {
    it('should create a 403 Forbidden response', async () => {
      const response = forbidden('{"error":"Access denied"}');
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
      expect(response.statusText).toBe(getStatusText(HttpStatus.FORBIDDEN));
      expect(await response.json()).toEqual({ error: 'Access denied' });
      expect(response.headers.get('Content-Type')).toBe(
        MediaType.APPLICATION_JSON_UTF8
      );
    });
  });

  describe('notFound', () => {
    it('should create a 404 Not Found response', async () => {
      const response = notFound('{"error":"Resource not found"}');
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.statusText).toBe(getStatusText(HttpStatus.NOT_FOUND));
      expect(await response.json()).toEqual({ error: 'Resource not found' });
      expect(response.headers.get('Content-Type')).toBe(
        MediaType.APPLICATION_JSON_UTF8
      );
    });
  });

  describe('tooLarge', () => {
    it('should create a 413 Request Entity Too Large response', async () => {
      const response = tooLarge('{"error":"Request too large"}');
      expect(response.status).toBe(HttpStatus.REQUEST_ENTITY_TOO_LARGE);
      expect(response.statusText).toBe(
        getStatusText(HttpStatus.REQUEST_ENTITY_TOO_LARGE)
      );
      expect(await response.json()).toEqual({ error: 'Request too large' });
      expect(response.headers.get('Content-Type')).toBe(
        MediaType.APPLICATION_JSON_UTF8
      );
    });
  });

  describe('internalServerError', () => {
    it('should create a 500 Internal Server Error response', async () => {
      const response = internalServerError('{"error":"Internal Server Error"}');
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.statusText).toBe(
        getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      );
      expect(await response.text()).toBe('{"error":"Internal Server Error"}');
      expect(response.headers.get('Content-Type')).toBe(
        MediaType.APPLICATION_JSON_UTF8
      );
    });
  });
});
