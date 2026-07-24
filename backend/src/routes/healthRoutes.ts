import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// Liveness probe (cheap and quick)
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Readiness probe (DB + Redis check)
router.get('/ready', async (_req: Request, res: Response) => {
  const checks: Record<string, string> = {
    database: 'unknown',
  };

  let isReady = true;

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'healthy';
  } catch (err: any) {
    checks.database = `unhealthy: ${err.message}`;
    isReady = false;
  }

  const statusCode = isReady ? 200 : 503;
  res.status(statusCode).json({
    status: isReady ? 'ready' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  });
});

export default router;
