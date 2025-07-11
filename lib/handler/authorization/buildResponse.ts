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

import { AuthorizationPageModel } from '@vecrea/au3te-ts-common/handler.authorization-page';

/**
 * A function that generates a Response from an AuthorizationPageModel.
 *
 * @param model AuthorizationPageModel
 * @returns Promise<Response>
 */
export type BuildResponse = (
  model: AuthorizationPageModel
) => Promise<Response>;

/**
 * A function that returns an AuthorizationPageModel in JSON format.
 *
 * @param model AuthorizationPageModel
 * @returns Promise<Response>
 */
export const simpleBuildResponse: BuildResponse = async (model) =>
  new Response(JSON.stringify(model), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
