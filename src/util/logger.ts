import pino from 'pino';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Configure base logger
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  serializers: {
    err: pino.stdSerializers.err,
    req: (req) => ({
      method: req.method,
      url: req.url,
      path: req.path,
      parameters: {
        query: req.query,
        params: req.params,
        body: req.body,
      },
      headers: {
        ...req.headers,
        authorization: req.headers && req.headers.authorization ? '[REDACTED]' : undefined,
      },
      ip: req.ip,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      headers: res.getHeaders(),
    }),
  },
});

// Request tracking interface
export interface TrackedRequest extends Request {
  id: string;
  startTime: number;
}

// Generate request ID if not provided
export const getRequestId = (req: Request): string => {
  return (req.headers['x-request-id'] as string) || randomUUID();
};

// Enrich error objects with additional context
export const enrichError = (err: Error, req: TrackedRequest) => {
  return {
    error: {
      type: err.constructor.name,
      message: err.message,
      stack: err.stack,
    },
    request: {
      id: req.id,
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: {
        ...req.headers,
        authorization: req.headers.authorization ? '[REDACTED]' : undefined,
      },
      ip: req.ip,
    },
    duration: Date.now() - req.startTime,
  };
};

// Utility function to safely stringify objects
export const safeStringify = (obj: any): string => {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return '[Circular]';
      }
      cache.add(value);
    }
    return value;
  });
};
