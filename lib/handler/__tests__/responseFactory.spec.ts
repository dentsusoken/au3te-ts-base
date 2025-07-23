import { describe, it, expect } from 'vitest';
import { defaultResponseFactory, Headers } from '../responseFactory';
import { HttpStatus, MediaType } from '@vecrea/au3te-ts-common/utils';

describe('responseFactory', () => {
  describe('createResponse', () => {
    it('should create a response with the specified status, content type, body, and headers', () => {
      const status = HttpStatus.OK;
      const contentType = MediaType.APPLICATION_JSON_UTF8;
      const body = '{"message": "test"}';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = defaultResponseFactory.createResponse(
        status,
        contentType,
        body,
        headers
      );

      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.headers.get('Pragma')).toBe('no-cache');
    });

    it('should create a response without content type when undefined', () => {
      const response = defaultResponseFactory.createResponse(
        HttpStatus.NO_CONTENT,
        undefined,
        undefined
      );

      expect(response.status).toBe(204);
      expect(response.headers.get('Content-Type')).toBeNull();
    });
  });

  describe('ok', () => {
    it('should create a 200 OK response with JSON content type', async () => {
      const body = '{"message": "success"}';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = defaultResponseFactory.ok(body, headers);

      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });

    it('should create a 200 OK response without body', async () => {
      const response = defaultResponseFactory.ok();

      expect(response.status).toBe(200);
      expect(await response.text()).toBe('');
    });
  });

  describe('okJwt', () => {
    it('should create a 200 OK response with JWT content type', async () => {
      const body = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = defaultResponseFactory.okJwt(body, headers);

      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.headers.get('Content-Type')).toBe('application/jwt');
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });
  });

  describe('form', () => {
    it('should create a 200 OK response with HTML content type', async () => {
      const body = '<html><body>Form content</body></html>';

      const response = defaultResponseFactory.form(body);

      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.headers.get('Content-Type')).toBe(
        'text/html;charset=utf-8'
      );
      expect(await response.text()).toBe(body);
    });
  });

  describe('created', () => {
    it('should create a 201 Created response', async () => {
      const body = '{"id": "123", "status": "created"}';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = defaultResponseFactory.created(body, headers);

      expect(response.status).toBe(201);
      expect(response.statusText).toBe('Created');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });
  });

  describe('accepted', () => {
    it('should create a 202 Accepted response with JSON content type', async () => {
      const body = '{"status": "accepted"}';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = defaultResponseFactory.accepted(body, headers);

      expect(response.status).toBe(202);
      expect(response.statusText).toBe('Accepted');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });
  });

  describe('acceptedJwt', () => {
    it('should create a 202 Accepted response with JWT content type', async () => {
      const body = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = defaultResponseFactory.acceptedJwt(body, headers);

      expect(response.status).toBe(202);
      expect(response.statusText).toBe('Accepted');
      expect(response.headers.get('Content-Type')).toBe('application/jwt');
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });
  });

  describe('noContent', () => {
    it('should create a 204 No Content response', async () => {
      const response = defaultResponseFactory.noContent();

      expect(response.status).toBe(204);
      expect(response.statusText).toBe('No Content');
      expect(response.headers.get('Content-Type')).toBeNull();
      expect(await response.text()).toBe('');
    });
  });

  describe('location', () => {
    it('should create a 302 Found response with Location header', async () => {
      const locationUrl = 'https://example.com/redirect';

      const response = defaultResponseFactory.location(locationUrl);

      expect(response.status).toBe(302);
      expect(response.statusText).toBe('Found');
      expect(response.headers.get('Location')).toBe(locationUrl);
      expect(response.headers.get('Content-Type')).toBeNull();
      expect(await response.text()).toBe('');
    });
  });

  describe('badRequest', () => {
    it('should create a 400 Bad Request response', async () => {
      const body = '{"error": "bad_request", "message": "Invalid request"}';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = await defaultResponseFactory.badRequest(body, headers);

      expect(response.status).toBe(400);
      expect(response.statusText).toBe('Bad Request');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });
  });

  describe('unauthorized', () => {
    it('should create a 401 Unauthorized response with WWW-Authenticate header', async () => {
      const body =
        '{"error": "unauthorized", "message": "Authentication required"}';
      const challenge = 'Bearer realm="example"';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = await defaultResponseFactory.unauthorized(
        body,
        challenge,
        headers
      );

      expect(response.status).toBe(401);
      expect(response.statusText).toBe('Unauthorized');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('WWW-Authenticate')).toBe(challenge);
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });

    it('should create a 401 Unauthorized response without WWW-Authenticate header', async () => {
      const body = '{"error": "unauthorized"}';

      const response = await defaultResponseFactory.unauthorized(body);

      expect(response.status).toBe(401);
      expect(response.headers.get('WWW-Authenticate')).toBeNull();
      expect(await response.text()).toBe(body);
    });
  });

  describe('forbidden', () => {
    it('should create a 403 Forbidden response', async () => {
      const body = '{"error": "forbidden", "message": "Access denied"}';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = await defaultResponseFactory.forbidden(body, headers);

      expect(response.status).toBe(403);
      expect(response.statusText).toBe('Forbidden');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });
  });

  describe('notFound', () => {
    it('should create a 404 Not Found response', async () => {
      const body = '{"error": "not_found", "message": "Resource not found"}';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = await defaultResponseFactory.notFound(body, headers);

      expect(response.status).toBe(404);
      expect(response.statusText).toBe('Not Found');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });
  });

  describe('tooLarge', () => {
    it('should create a 413 Request Entity Too Large response', async () => {
      const body =
        '{"error": "request_entity_too_large", "message": "Request too large"}';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = await defaultResponseFactory.tooLarge(body, headers);

      expect(response.status).toBe(413);
      expect(response.statusText).toBe('Request Entity Too Large');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });
  });

  describe('internalServerError', () => {
    it('should create a 500 Internal Server Error response', async () => {
      const body =
        '{"error": "internal_server_error", "message": "Internal server error"}';
      const headers: Headers = { 'X-Custom': 'value' };

      const response = await defaultResponseFactory.internalServerError(
        body,
        headers
      );

      expect(response.status).toBe(500);
      expect(response.statusText).toBe('Internal Server Error');
      expect(response.headers.get('Content-Type')).toBe(
        'application/json;charset=utf-8'
      );
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(await response.text()).toBe(body);
    });
  });

  describe('fixed headers', () => {
    it('should include Cache-Control and Pragma headers in all responses', () => {
      const response = defaultResponseFactory.ok();

      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.headers.get('Pragma')).toBe('no-cache');
    });

    it('should preserve custom headers while including fixed headers', () => {
      const customHeaders: Headers = { 'X-Custom': 'value' };
      const response = defaultResponseFactory.ok('test', customHeaders);

      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.headers.get('Pragma')).toBe('no-cache');
      expect(response.headers.get('X-Custom')).toBe('value');
    });
  });
});
