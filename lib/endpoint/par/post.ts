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

import { runAsyncCatching } from 'au3te-ts-common/utils';
import { ToApiRequest } from './toApiRequest';
import { ProcessApiRequest } from './processApiRequest';
import { ProcessApiResponse } from './processApiResponse';
import { RecoverResponseResult } from '../recoverResponseResult';

/**
 * Represents a function that handles HTTP POST requests.
 *
 * @typedef {Function} Post
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<Response>} A promise that resolves to the HTTP response.
 */
export type Post = (request: Request) => Promise<Response>;

/**
 * Parameters required to create a POST handler function.
 *
 * @typedef {Object} CreatePostParams
 * @property {ToApiRequest} toApiRequest - Function to convert the HTTP request to an API request.
 * @property {ProcessApiRequest} processApiRequest - Function to process the API request.
 * @property {ProcessApiResponse} processApiResponse - Function to process the API response.
 * @property {RecoverResponseResult} recoverResponseResult - Function to handle and recover from errors.
 */
export type CreatePostParams = {
  toApiRequest: ToApiRequest;
  processApiRequest: ProcessApiRequest;
  processApiResponse: ProcessApiResponse;
  recoverResponseResult: RecoverResponseResult;
};

/**
 * Creates a POST handler function for processing authorization requests.
 *
 * This function sets up a pipeline for handling POST requests, including
 * request conversion, API processing, response processing, and error handling.
 *
 * @param {CreatePostParams} params - The parameters required to create the POST handler.
 * @returns {Post} A function that handles POST requests.
 *
 * @example
 * const postHandler = createPost({
 *   toApiRequest: convertToApiRequest,
 *   processApiRequest: handleApiRequest,
 *   processApiResponse: formatApiResponse,
 *   recoverResponseResult: handleErrors
 * });
 *
 * // Usage
 * app.post('/authorize', async (req, res) => {
 *   const response = await postHandler(req);
 *   res.status(response.status).send(response.body);
 * });
 */
export const createPost =
  ({
    toApiRequest,
    processApiRequest,
    processApiResponse,
    recoverResponseResult,
  }: CreatePostParams): Post =>
  async (request: Request): Promise<Response> => {
    const responseResult = await runAsyncCatching(async () => {
      const apiRequest = await toApiRequest(request);
      const apiResponse = await processApiRequest(apiRequest);

      return processApiResponse(apiResponse);
    });

    return await recoverResponseResult(responseResult);
  };
