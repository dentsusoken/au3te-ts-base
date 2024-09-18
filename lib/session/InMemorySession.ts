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

import { Session, SessionValue } from './Session';

/**
 * In-memory implementation of the Session interface.
 *
 * @template T - The type of session data, where keys are strings and values are SessionValue.
 * @implements {Session<T>}
 */
export class InMemorySession<T extends Record<string, SessionValue>>
  implements Session<T>
{
  /** @private */
  private data = {} as T;

  /**
   * Retrieves the value associated with the specified key.
   *
   * @template K - The key type, which must be a key of T.
   * @param {K} key - The key to retrieve the value for.
   * @returns {Promise<T[K] | undefined>} A promise that resolves with the value, or undefined if not found.
   */
  async get<K extends keyof T>(key: K): Promise<T[K] | undefined> {
    return this.data[key];
  }

  /**
   * Retrieves multiple values associated with the specified keys.
   *
   * @template K - The key type, which must be a key of T.
   * @param {...K} keys - The keys to retrieve values for.
   * @returns {Promise<{ [P in K]: T[P] | undefined }>} A promise that resolves with an object containing the retrieved values.
   */
  async getBatch<K extends keyof T>(
    ...keys: K[]
  ): Promise<{ [P in K]: T[P] | undefined }> {
    const result = {} as {
      [P in K]: T[P] | undefined;
    };
    keys.forEach((key) => {
      result[key] = this.data[key];
    });
    return result;
  }

  /**
   * Sets the value for the specified key.
   *
   * @template K - The key type, which must be a key of T.
   * @param {K} key - The key to set the value for.
   * @param {T[K]} value - The value to set.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    this.data[key] = value;
  }

  /**
   * Sets multiple key-value pairs in the session.
   *
   * @param {Partial<T>} batch - An object containing the key-value pairs to set.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async setBatch(batch: Partial<T>): Promise<void> {
    this.data = { ...this.data, ...batch };
  }

  /**
   * Deletes the value associated with the specified key.
   *
   * @template K - The key type, which must be a key of T.
   * @param {K} key - The key to delete the value for.
   * @returns {Promise<T[K] | undefined>} A promise that resolves with the deleted value, or undefined if not found.
   */
  async delete<K extends keyof T>(key: K): Promise<T[K] | undefined> {
    const result = this.data[key];
    delete this.data[key];
    return result;
  }

  /**
   * Deletes multiple values associated with the specified keys.
   *
   * @template K - The key type, which must be a key of T.
   * @param {...K} keys - The keys to delete values for.
   * @returns {Promise<{ [P in K]: T[P] | undefined }>} A promise that resolves with an object containing the deleted values.
   */
  async deleteBatch<K extends keyof T>(
    ...keys: K[]
  ): Promise<{ [P in K]: T[P] | undefined }> {
    const result = {} as {
      [P in K]: T[P] | undefined;
    };
    keys.forEach((key) => {
      result[key] = this.data[key];
      delete this.data[key];
    });
    return result;
  }

  /**
   * Clears all key-value pairs from the session.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async clear(): Promise<void> {
    this.data = {} as T;
  }
}
