import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../lib/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  (req as any).id = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    // Skip verbose logs for health checks
    if (originalUrl === '/api/health') return;

    logger.info(
      {
        requestId,
        method,
        url: originalUrl,
        statusCode,
        durationMs: duration,
      },
      `${method} ${originalUrl} ${statusCode} - ${duration}ms`
    );
  });

  next();
}

// TODO: pipe structured logs to external SIEM in v2
