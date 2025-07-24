/*
 * Copyright (C) 2014-2024 Authlete, Inc.
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

import { ResponseError } from './ResponseError';
import { Headers, ResponseFactory } from './responseFactory';

/**
 * Interface for ResponseErrorFactory that provides methods to create ResponseError instances.
 */
export interface ResponseErrorFactory {
  /**
   * Creates a ResponseError for a bad request with the given error message.
   */
  badRequestResponseError(
    message?: string | null,
    headers?: Headers
  ): ResponseError;

  /**
   * Creates a ResponseError for an internal server error with the given error message.
   */
  internalServerErrorResponseError(
    message?: string | null,
    headers?: Headers
  ): ResponseError;

  /**
   * Creates a ResponseError for a not found error with the given error message.
   */
  notFoundResponseError(
    message?: string | null,
    headers?: Headers
  ): ResponseError;

  /**
   * Creates a ResponseError for an unauthorized request with the given error message.
   */
  unauthorizedResponseError(
    message?: string | null,
    challenge?: string | null,
    headers?: Headers
  ): ResponseError;

  /**
   * Creates a ResponseError for a forbidden request with the given error message.
   */
  forbiddenResponseError(
    message?: string | null,
    headers?: Headers
  ): ResponseError;

  /**
   * Creates a ResponseError for a payload too large error with the given error message.
   */
  tooLargeResponseError(
    message?: string | null,
    headers?: Headers
  ): ResponseError;
}

export const createResponseErrorFactory = (
  responseFactory: ResponseFactory
): ResponseErrorFactory => {
  return {
    badRequestResponseError: (
      message?: string | null,
      headers?: Headers
    ): ResponseError => {
      const finalMessage = message ?? 'bad_request';
      const body = JSON.stringify({
        error: 'bad_request',
        error_description: finalMessage,
      });

      const response = responseFactory.badRequest(body, headers);
      return new ResponseError(finalMessage, response);
    },

    internalServerErrorResponseError: (
      message?: string | null,
      headers?: Headers
    ): ResponseError => {
      const finalMessage = message ?? 'internal_server_error';
      const body = JSON.stringify({
        error: 'internal_server_error',
        error_description: finalMessage,
      });

      const response = responseFactory.internalServerError(body, headers);
      return new ResponseError(finalMessage, response);
    },

    notFoundResponseError: (
      message?: string | null,
      headers?: Headers
    ): ResponseError => {
      const finalMessage = message ?? 'not_found';
      const body = JSON.stringify({
        error: 'not_found',
        error_description: finalMessage,
      });

      const response = responseFactory.notFound(body, headers);
      return new ResponseError(finalMessage, response);
    },

    unauthorizedResponseError: (
      message?: string | null,
      challenge?: string | null,
      headers?: Headers
    ): ResponseError => {
      const finalMessage = message ?? 'unauthorized';
      const body = JSON.stringify({
        error: 'unauthorized',
        error_description: finalMessage,
      });

      const response = responseFactory.unauthorized(body, challenge, headers);
      return new ResponseError(finalMessage, response);
    },

    forbiddenResponseError: (
      message?: string | null,
      headers?: Headers
    ): ResponseError => {
      const finalMessage = message ?? 'forbidden';
      const body = JSON.stringify({
        error: 'forbidden',
        error_description: finalMessage,
      });

      const response = responseFactory.forbidden(body, headers);
      return new ResponseError(finalMessage, response);
    },

    tooLargeResponseError: (message?: string | null, headers?: Headers) => {
      const finalMessage = message ?? 'payload_too_large';
      const body = JSON.stringify({
        error: 'payload_too_large',
        error_description: finalMessage,
      });

      const response = responseFactory.tooLarge(body, headers);
      return new ResponseError(finalMessage, response);
    },
  };
};
