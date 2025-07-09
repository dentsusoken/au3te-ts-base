import { CommonHandlerConfiguration } from '@vecrea/au3te-ts-common/handler';
import { RecoverResponseResult } from './recoverResponseResult';
import { Session } from '../session/Session';
import { SessionSchemas } from '../session/types';
import { ApiClient } from '@vecrea/au3te-ts-common/api';
import { PrepareHeaders } from './prepareHeaders';

/**
 * Interface representing the server configuration for handlers.
 * @template SS - The type of session schemas, extending SessionSchemas.
 * @extends {CommonHandlerConfiguration}
 */
export interface ServerHandlerConfiguration<SS extends SessionSchemas>
  extends CommonHandlerConfiguration {
  /**
   * The API client used for making requests.
   */
  apiClient: ApiClient;

  /**
   * The session object for managing user sessions.
   */
  session: Session<SS>;

  /**
   * Function to recover from response errors.
   */
  recoverResponseResult: RecoverResponseResult;

  /**
   * Function to prepare response headers.
   */
  prepareHeaders: PrepareHeaders;
}
