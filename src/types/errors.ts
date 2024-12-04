// Custom error classes
export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized access') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource already exists') {
    super(409, message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad request') {
    super(400, message, 'BAD_REQUEST');
    this.name = 'BadRequestError';
  }
}

// Error response interface
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  requestId: string;
  timestamp: string;
  path: string;
  method: string;
}
