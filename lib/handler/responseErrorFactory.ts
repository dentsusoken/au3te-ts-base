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
import * as responseFactory from '../utils/responseFactory';

/**
 * Creates a ResponseError for a bad request with the given error message.
 *
 * @param {string} message - The error message describing why the request was bad
 * @returns {ResponseError} A ResponseError instance with a 400 Bad Request response
 */
export const badRequestError = (message: string): ResponseError => {
  const body = JSON.stringify({
    error: 'bad_request',
    error_description: message,
  });

  return new ResponseError(message, responseFactory.badRequest(body));
};

/**
 * Creates a ResponseError for an internal server error with the given error message.
 *
 * @param {string} message - The error message describing the internal server error
 * @returns {ResponseError} A ResponseError instance with a 500 Internal Server Error response
 */
export const internalServerErrorError = (message: string): ResponseError => {
  const body = JSON.stringify({
    error: 'internal_server_error',
    error_description: message,
  });

  return new ResponseError(message, responseFactory.internalServerError(body));
};
