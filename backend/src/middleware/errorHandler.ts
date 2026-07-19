import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../lib/logger.js';
import { SsrfError } from '../lib/ssrfGuard.js';

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any[];

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details?: any[]) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const requestId = (req as any).id || 'unknown';

  // Zod Validation Error
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    logger.warn({ requestId, details }, 'Validation error');
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input parameters',
        details,
      },
    });
  }

  // SSRF Guard Error
  if (err instanceof SsrfError) {
    logger.warn({ requestId, err: err.message }, 'SSRF blocked request');
    return res.status(400).json({
      error: {
        code: err.code || 'SSRF_BLOCKED',
        message: err.message,
        details: [],
      },
    });
  }

  // Custom App Error
  if (err instanceof AppError) {
    logger.warn({ requestId, code: err.code, message: err.message }, 'Application error');
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details || [],
      },
    });
  }

  // Generic / Unexpected Error
  logger.error({ requestId, err }, 'Unhandled server error');
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      details: [],
    },
  });
}

// 2026-07-19: aligned error codes with RFC 7807 problem+json spec
