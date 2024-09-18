/*
 * Copyright (C) 2019-2024 Authlete, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the
 * License.
 */

import { HttpStatus, MediaType, getStatusText } from 'au3te-ts-common/utils';

/**
 * Fixed headers to be included in all responses.
 */
const fixedHeaders = {
  'Cache-Control': 'no-store',
  Pragma: 'no-cache',
};

/** Type alias for headers object. */
export type Headers = Record<string, string>;

/**
 * Creates a new Response object with the specified status, content type, body, and headers.
 *
 * @param status - The HTTP status code for the response.
 * @param contentType - The media type of the response content.
 * @param body - The body of the response.
 * @param headers - Additional headers to include in the response.
 * @returns A new Response object.
 */
export const createResponse = (
  status: HttpStatus,
  contentType: MediaType | undefined,
  body: string | undefined,
  headers: Headers = {}
) => {
  const newHeaders: Headers = {
    ...fixedHeaders,
    ...headers,
  };

  if (contentType) {
    newHeaders['Content-Type'] = contentType;
  }
  return new Response(body, {
    status,
    statusText: getStatusText(status),
    headers: newHeaders,
  });
};

/**
 * Creates a 200 OK response.
 *
 * @param body - The body of the response.
 * @param headers - Additional headers to include in the response.
 * @returns A new Response object with 200 OK status.
 */
export const ok = (body?: string, headers?: Headers) =>
  createResponse(HttpStatus.OK, MediaType.APPLICATION_JSON_UTF8, body, headers);

/**
 * Creates an HTTP response with a 200 OK status and HTML content.
 *
 * This function is typically used to generate responses for form-based
 * interactions, such as those defined in the OAuth 2.0 Form Post Response Mode.
 *
 * @param {string} [body] - The HTML content to be included in the response body.
 *                          If omitted, an empty body will be returned.
 * @returns {Response} A Response object with:
 *                     - Status: 200 OK
 *                     - Content-Type: text/html;charset=UTF-8
 *                     - Body: The provided HTML content or empty if not provided
 *
 * @see {@link https://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html|OAuth 2.0 Form Post Response Mode}
 */
export const form = (body?: string) =>
  createResponse(HttpStatus.OK, MediaType.TEXT_HTML_UTF8, body);

/**
 * Creates a 201 Created response.
 *
 * @param body - The body of the response.
 * @param headers - Additional headers to include in the response.
 * @returns A new Response object with 201 Created status.
 */
export const created = (body?: string, headers?: Headers) =>
  createResponse(
    HttpStatus.CREATED,
    MediaType.APPLICATION_JSON_UTF8,
    body,
    headers
  );

/**
 * Creates a 204 No Content response.
 *
 * @returns A new Response object with 204 No Content status.
 */
export const noContent = () =>
  createResponse(HttpStatus.NO_CONTENT, undefined, undefined);

/**
 * Creates a 302 Found response with a Location header for redirection.
 *
 * @param location - The URL to which the client should be redirected. This value will be
 *                   set as the Location header in the response.
 * @returns A new Response object with 302 Found status and a Location header.
 *          The response body is empty and no content type is set.
 */
export const location = (location: string) =>
  createResponse(HttpStatus.FOUND, undefined, undefined, {
    Location: location,
  });

/**
 * Creates a 400 Bad Request response.
 *
 * @param body - The body of the response.
 * @param headers - Additional headers to include in the response.
 * @returns A new Response object with 400 Bad Request status.
 */
export const badRequest = (body?: string, headers?: Headers) =>
  createResponse(
    HttpStatus.BAD_REQUEST,
    MediaType.APPLICATION_JSON_UTF8,
    body,
    headers
  );

/**
 * Creates a 401 Unauthorized response.
 *
 * @param body - The body of the response.
 * @param challenge - The value for the WWW-Authenticate header.
 * @param headers - Additional headers to include in the response.
 * @returns A new Response object with 401 Unauthorized status.
 */
export const unauthorized = (
  body?: string,
  challenge?: string,
  headers?: Headers
) =>
  createResponse(
    HttpStatus.UNAUTHORIZED,
    MediaType.APPLICATION_JSON_UTF8,
    body,
    {
      'WWW-Authenticate': challenge,
      ...headers,
    } as Headers
  );

/**
 * Creates a 403 Forbidden response.
 *
 * @param body - The body of the response.
 * @param headers - Additional headers to include in the response.
 * @returns A new Response object with 403 Forbidden status.
 */
export const forbidden = (body?: string, headers?: Headers) =>
  createResponse(
    HttpStatus.FORBIDDEN,
    MediaType.APPLICATION_JSON_UTF8,
    body,
    headers
  );

/**
 * Creates a 404 Not Found response.
 *
 * @param body - The body of the response.
 * @param headers - Additional headers to include in the response.
 * @returns A new Response object with 404 Not Found status.
 */
export const notFound = (body?: string, headers?: Headers) =>
  createResponse(
    HttpStatus.NOT_FOUND,
    MediaType.APPLICATION_JSON_UTF8,
    body,
    headers
  );

/**
 * Creates a 413 Request Entity Too Large response.
 *
 * @param body - Optional. The JSON string to be included in the response body.
 *               This could contain details about size limits or error information.
 * @param headers - Optional. Additional headers to include in the response.
 *                  These will be merged with the default headers.
 * @returns A new Response object with 413 Request Entity Too Large status
 *          and application/json;charset=utf-8 content type.
 */
export const tooLarge = (body?: string, headers?: Headers) =>
  createResponse(
    HttpStatus.REQUEST_ENTITY_TOO_LARGE,
    MediaType.APPLICATION_JSON_UTF8,
    body,
    headers
  );

/**
 * Creates a 500 Internal Server Error response.
 *
 * @param body - The body of the response.
 * @param headers - Additional headers to include in the response.
 * @returns A new Response object with 500 Internal Server Error status.
 */
export const internalServerError = (body?: string, headers?: Headers) =>
  createResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    MediaType.APPLICATION_JSON_UTF8,
    body,
    headers
  );
