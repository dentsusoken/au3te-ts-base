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

export const APPLICATION_JSON_MEDIA_TYPE = 'application/json';

export const APPLICATION_JSON_UTF8_CONTENT_TYPE = `${APPLICATION_JSON_MEDIA_TYPE};charset=utf-8`;

export const APPLICATION_FORM_URLENCODED_MEDIA_TYPE =
  'application/x-www-form-urlencoded';

export const TEXT_HTML_MEDIA_TYPE = 'text/html';

export const TEXT_PLAIN_MEDIA_TYPE = 'text/plain';

export const APPLICATION_JWT_MEDIA_TYPE = 'application/jwt';

export const isMediaTypeEqual = (
  expectedType: string,
  targetType: string | undefined
): boolean => {
  if (!targetType) {
    return false;
  }

  if (expectedType === targetType) {
    return true;
  }

  const mediaTypeOnly = targetType.split(';')[0];

  return expectedType === mediaTypeOnly;
};

export const isJsonType = (type: string | undefined) =>
  isMediaTypeEqual(APPLICATION_JSON_MEDIA_TYPE, type);

export const isFormUrlEncodedType = (type: string | undefined) =>
  isMediaTypeEqual(APPLICATION_FORM_URLENCODED_MEDIA_TYPE, type);
