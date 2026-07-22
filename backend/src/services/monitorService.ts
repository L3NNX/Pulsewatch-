import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { validateUrlAgainstSsrf } from '../lib/ssrfGuard.js';
import { executeProbe } from './probeService.js';
import { HttpMethod, MonitorStatus } from '@prisma/client';

export const MAX_MONITORS_PER_USER = 10;
export const MIN_INTERVAL_SECONDS = 60;
export const DEFAULT_TIMEOUT_MS = 10000;

export interface CreateMonitorInput {
  name: string;
  url: string;
  method?: HttpMethod;
  intervalSeconds?: number;
  timeoutMs?: number;
  expectedStatusMin?: number;
  expectedStatusMax?: number;
}

export interface UpdateMonitorInput {
  name?: string;
  url?: string;
  method?: HttpMethod;
  intervalSeconds?: number;
  timeoutMs?: number;
  expectedStatusMin?: number;
  expectedStatusMax?: number;
  isActive?: boolean;
}

export async function listUserMonitors(userId: string) {
  const monitors = await prisma.monitor.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate 24h uptime for each monitor
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const monitorsWithStats = await Promise.all(
    monitors.map(async (m) => {
      const recentChecks = await prisma.check.findMany({
        where: {
          monitorId: m.id,
          checkedAt: { gte: twentyFourHoursAgo },
        },
        select: { isSuccess: true, responseTimeMs: true },
      });

      let uptime24h = 100;
      let avgResponseTimeMs = 0;

      if (recentChecks.length > 0) {
        const successes = recentChecks.filter((c) => c.isSuccess).length;
        uptime24h = Number(((successes / recentChecks.length) * 100).toFixed(2));

        const times = recentChecks.map((c) => c.responseTimeMs || 0).filter((t) => t > 0);
        if (times.length > 0) {
          avgResponseTimeMs = Math.round(times.reduce((acc, val) => acc + val, 0) / times.length);
        }
      }

      return {
        ...m,
        uptime24h,
        avgResponseTimeMs,
        checksCount24h: recentChecks.length,
      };
    })
  );

  return monitorsWithStats;
}

export async function createMonitor(userId: string, data: CreateMonitorInput) {
  // Check user limit
  const count = await prisma.monitor.count({ where: { userId } });
  if (count >= MAX_MONITORS_PER_USER) {
    throw new AppError(
      `Free tier limit reached. You can create up to ${MAX_MONITORS_PER_USER} monitors.`,
      400,
      'LIMIT_EXCEEDED'
    );
  }

  // SSRF guard check
  await validateUrlAgainstSsrf(data.url);

  const monitor = await prisma.monitor.create({
    data: {
      userId,
      name: data.name.trim(),
      url: data.url.trim(),
      method: data.method || HttpMethod.GET,
      intervalSeconds: Math.max(MIN_INTERVAL_SECONDS, data.intervalSeconds || 300),
      timeoutMs: data.timeoutMs || DEFAULT_TIMEOUT_MS,
      expectedStatusMin: data.expectedStatusMin || 200,
      expectedStatusMax: data.expectedStatusMax || 399,
      status: MonitorStatus.PENDING,
      isActive: true,
    },
  });

  // Execute initial probe immediately in background
  executeProbe(monitor.id).catch((err) => {
    // Probe failure logged inside executeProbe
  });

  return monitor;
}

export async function checkMonitorNow(userId: string, monitorId: string) {
  const existing = await prisma.monitor.findUnique({ where: { id: monitorId } });
  if (!existing) {
    throw new AppError('Monitor not found.', 404, 'NOT_FOUND');
  }
  if (existing.userId !== userId) {
    throw new AppError('Access denied. You do not own this monitor.', 403, 'FORBIDDEN');
  }

  const result = await executeProbe(monitorId);
  return result;
}

export async function getMonitorById(userId: string, monitorId: string) {
  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId },
    include: {
      incidents: {
        orderBy: { startedAt: 'desc' },
        take: 5,
      },
      checks: {
        orderBy: { checkedAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!monitor) {
    throw new AppError('Monitor not found.', 404, 'NOT_FOUND');
  }

  if (monitor.userId !== userId) {
    throw new AppError('Access denied. You do not own this monitor.', 403, 'FORBIDDEN');
  }

  // Serialize BigInt check IDs to string for JSON output
  const serializedChecks = monitor.checks.map((c) => ({
    ...c,
    id: c.id.toString(),
  }));

  return {
    ...monitor,
    checks: serializedChecks,
  };
}

export async function updateMonitor(userId: string, monitorId: string, data: UpdateMonitorInput) {
  // Check ownership
  const existing = await prisma.monitor.findUnique({ where: { id: monitorId } });
  if (!existing) {
    throw new AppError('Monitor not found.', 404, 'NOT_FOUND');
  }
  if (existing.userId !== userId) {
    throw new AppError('Access denied. You do not own this monitor.', 403, 'FORBIDDEN');
  }

  if (data.url && data.url !== existing.url) {
    await validateUrlAgainstSsrf(data.url);
  }

  const updated = await prisma.monitor.update({
    where: { id: monitorId },
    data: {
      name: data.name !== undefined ? data.name.trim() : undefined,
      url: data.url !== undefined ? data.url.trim() : undefined,
      method: data.method,
      intervalSeconds: data.intervalSeconds ? Math.max(MIN_INTERVAL_SECONDS, data.intervalSeconds) : undefined,
      timeoutMs: data.timeoutMs,
      expectedStatusMin: data.expectedStatusMin,
      expectedStatusMax: data.expectedStatusMax,
      isActive: data.isActive,
    },
  });

  return updated;
}

export async function deleteMonitor(userId: string, monitorId: string) {
  const existing = await prisma.monitor.findUnique({ where: { id: monitorId } });
  if (!existing) {
    throw new AppError('Monitor not found.', 404, 'NOT_FOUND');
  }
  if (existing.userId !== userId) {
    throw new AppError('Access denied. You do not own this monitor.', 403, 'FORBIDDEN');
  }

  await prisma.monitor.delete({ where: { id: monitorId } });
  return { success: true, message: 'Monitor deleted successfully' };
}

export async function pauseMonitor(userId: string, monitorId: string) {
  const existing = await prisma.monitor.findUnique({ where: { id: monitorId } });
  if (!existing) {
    throw new AppError('Monitor not found.', 404, 'NOT_FOUND');
  }
  if (existing.userId !== userId) {
    throw new AppError('Access denied. You do not own this monitor.', 403, 'FORBIDDEN');
  }

  const updated = await prisma.monitor.update({
    where: { id: monitorId },
    data: {
      status: MonitorStatus.PAUSED,
      isActive: false,
      lastStatusChangeAt: new Date(),
    },
  });

  return updated;
}

export async function resumeMonitor(userId: string, monitorId: string) {
  const existing = await prisma.monitor.findUnique({ where: { id: monitorId } });
  if (!existing) {
    throw new AppError('Monitor not found.', 404, 'NOT_FOUND');
  }
  if (existing.userId !== userId) {
    throw new AppError('Access denied. You do not own this monitor.', 403, 'FORBIDDEN');
  }

  const updated = await prisma.monitor.update({
    where: { id: monitorId },
    data: {
      status: MonitorStatus.PENDING,
      isActive: true,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastStatusChangeAt: new Date(),
    },
  });

  // Execute probe immediately upon resuming
  executeProbe(monitorId).catch(() => {});

  return updated;
}

// Pagination support planned for v2 — max 100 monitors per user enforced at DB level
