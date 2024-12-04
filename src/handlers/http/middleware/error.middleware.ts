import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../../../types/errors';
import { getRequestId, TrackedRequest } from '../../../util/logger';

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  requestId: string;
}

// Environment check
const isProduction = process.env.NODE_ENV === 'production';

// Main error handler
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const trackedReq = req as TrackedRequest;

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    },
    requestId: trackedReq.id,
  };

  // Handle specific error types
  if (err instanceof ApiError) {
    errorResponse.error.message = err.message;
    errorResponse.error.code = err.code;
    errorResponse.error.details = err.details;
    res.status(err.statusCode);
  } else if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((error) => ({
      path: error.path.join('.'),
      message: error.message,
    }));
    errorResponse.error.message = 'Validation Error';
    errorResponse.error.code = 'VALIDATION_ERROR';
    errorResponse.error.details = formattedErrors;
    res.status(400);
  } else {
    res.status(500);
    if (!isProduction) {
      errorResponse.error.details = {
        stack: err.stack,
        name: err.name,
      };
    }
  }

  res.json(errorResponse);
};

// Async handler wrapper
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
