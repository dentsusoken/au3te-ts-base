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

import { Session } from './Session';
import { sessionSchemas } from './sessionSchemas';

/**
 * Represents the base session type for the application.
 *
 * This type is a specialized version of the generic Session interface,
 * configured with the application's specific session schemas.
 * It provides type-safe access to session data as defined in sessionSchemas.
 *
 * @typedef {Session<typeof sessionSchemas>} BaseSession
 */
export type BaseSession = Session<typeof sessionSchemas>;
