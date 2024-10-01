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

import {
  CommonHandler,
  CommonHandlerConstructorOptions,
} from 'au3te-ts-common/handler';

/**
 * Options for constructing a BaseHandler.
 * Extends CommonHandlerConstructorOptions.
 */
export type BaseHandlerConstructorOptions = CommonHandlerConstructorOptions;

/**
 * Base handler class extending CommonHandler.
 * @extends CommonHandler
 */
export class BaseHandler extends CommonHandler {
  /**
   * Creates an instance of BaseHandler.
   * @param {string} path - The path for the handler.
   * @param {BaseHandlerConstructorOptions} [options={}] - Options for configuring the handler.
   */
  constructor(path: string, options: BaseHandlerConstructorOptions = {}) {
    super(path, options);
  }
}
