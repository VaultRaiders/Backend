import pino from 'pino';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { enrichError, getRequestId, logger, TrackedRequest } from '../../../util/logger';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const trackedReq = req as TrackedRequest;
  trackedReq.id = getRequestId(req);
  trackedReq.startTime = Date.now();

  // Set request ID in response headers
  res.setHeader('x-request-id', trackedReq.id);

  // Create child logger with request context
  const reqLogger = logger.child({
    requestId: trackedReq.id,
  });

  // Log request
  reqLogger.info({
    msg: 'Incoming request',
    req: trackedReq,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - trackedReq.startTime;
    const level = res.statusCode >= 400 ? 'error' : 'info';

    reqLogger[level]({
      msg: 'Request completed',
      res,
      responseTime: duration,
      req: {
        method: req.method,
        url: req.url,
      },
    });
  });

  next();
};

// Error logging middleware
export const errorLoggingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const trackedReq = req as TrackedRequest;

  logger.error({
    msg: 'Request error',
    ...enrichError(err, trackedReq),
  });

  next(err);
};

// Performance monitoring middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const trackedReq = req as TrackedRequest;
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    if (duration > 1000) {
      // Log slow requests (over 1 second)
      logger.warn({
        msg: 'Slow request detected',
        requestId: trackedReq.id,
        duration,
        method: req.method,
        url: req.url,
      });
    }
  });

  next();
};
