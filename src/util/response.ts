import { Response } from 'express';
import { logger } from './logger';

// Response type definitions
export interface SuccessResponse<T> {
  success: true;
  data: T;
  requestId: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  requestId: string;
}

/**
 * Send a success response
 */
export const sendSuccess = <T>(res: Response, data: T, statusCode = 200, meta?: SuccessResponse<T>['meta']): void => {
  const requestId = res.getHeader('x-request-id')?.toString() || 'unknown';

  const response: SuccessResponse<T> = {
    success: true,
    data,
    requestId,
    ...(meta && { meta }),
  };

  logger.info({
    msg: 'Sending success response',
    requestId,
    statusCode,
    // responseData: data,
  });

  res.status(statusCode).json(response);
};

/**
 * Send a paginated success response
 */
export const sendPaginated = <T>(res: Response, data: T[], page: number, limit: number, total: number): void => {
  sendSuccess(res, data, 200, { page, limit, total });
};

/**
 * Send a created response (201)
 */
export const sendCreated = <T>(res: Response, data: T): void => {
  sendSuccess(res, data, 201);
};

/**
 * Send an accepted response (202)
 */
export const sendAccepted = <T>(res: Response, data: T): void => {
  sendSuccess(res, data, 202);
};

/**
 * Send a no content response (204)
 */
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};