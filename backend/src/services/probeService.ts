import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';
import { validateUrlAgainstSsrf } from '../lib/ssrfGuard.js';
import { MonitorStatus, IncidentStatus } from '@prisma/client';

export interface ProbeResult {
  monitorId: string;
  isSuccess: boolean;
  statusCode?: number;
  responseTimeMs?: number;
  errorType?: string;
  errorMessage?: string;
}

export async function executeProbe(monitorId: string): Promise<ProbeResult> {
  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId },
  });

  if (!monitor || !monitor.isActive) {
    return {
      monitorId,
      isSuccess: false,
      errorType: 'INACTIVE',
      errorMessage: 'Monitor is inactive or not found',
    };
  }

  let isSuccess = false;
  let statusCode: number | undefined;
  let responseTimeMs: number | undefined;
  let errorType: string | undefined;
  let errorMessage: string | undefined;

  const startTime = Date.now();

  try {
    // 1. SSRF validation
    await validateUrlAgainstSsrf(monitor.url);

    // 2. HTTP probe execution
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), monitor.timeoutMs);

    const response = await fetch(monitor.url, {
      method: monitor.method,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'PulseWatch-Probe/1.0 (+https://pulsewatch.dev)',
        'Accept': '*/*',
      },
    });

    clearTimeout(timeoutId);
    responseTimeMs = Date.now() - startTime;
    statusCode = response.status;

    if (statusCode >= monitor.expectedStatusMin && statusCode <= monitor.expectedStatusMax) {
      isSuccess = true;
    } else {
      isSuccess = false;
      errorType = 'BAD_STATUS';
      errorMessage = `HTTP status ${statusCode} outside expected range [${monitor.expectedStatusMin}-${monitor.expectedStatusMax}]`;
    }
  } catch (err: any) {
    responseTimeMs = Date.now() - startTime;

    if (err.name === 'AbortError') {
      errorType = 'TIMEOUT';
      errorMessage = `Connection timed out after ${monitor.timeoutMs}ms`;
    } else if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
      errorType = 'DNS';
      errorMessage = `DNS resolution failed: ${err.message}`;
    } else if (err.code === 'ECONNREFUSED') {
      errorType = 'CONNECTION_REFUSED';
      errorMessage = 'Connection refused by destination host';
    } else if (err.name === 'SsrfError' || err.message?.includes('SSRF') || err.message?.includes('private or reserved')) {
      errorType = 'BLOCKED_URL';
      errorMessage = err.message;
    } else {
      errorType = 'NETWORK_ERROR';
      errorMessage = err.message || 'Unknown network error';
    }
  }

  // 3. Persist check and update monitor state
  try {
    await prisma.$transaction(async (tx) => {
      // Save Check record
      await tx.check.create({
        data: {
          monitorId: monitor.id,
          isSuccess,
          statusCode,
          responseTimeMs,
          errorType,
          errorMessage,
          checkedAt: new Date(),
        },
      });

      let nextStatus = monitor.status;
      let consecutiveSuccesses = monitor.consecutiveSuccesses;
      let consecutiveFailures = monitor.consecutiveFailures;
      let statusChanged = false;

      if (isSuccess) {
        consecutiveSuccesses += 1;
        consecutiveFailures = 0;

        // If newly created/PENDING, transition immediately to UP
        if (monitor.status === MonitorStatus.PENDING) {
          nextStatus = MonitorStatus.UP;
          statusChanged = true;
        } else if (monitor.status === MonitorStatus.DOWN && consecutiveSuccesses >= 2) {
          // 2 consecutive successes to resolve DOWN status
          nextStatus = MonitorStatus.UP;
          statusChanged = true;

          // Resolve open incident
          await tx.incident.updateMany({
            where: {
              monitorId: monitor.id,
              status: IncidentStatus.OPEN,
            },
            data: {
              status: IncidentStatus.RESOLVED,
              resolvedAt: new Date(),
            },
          });
        }
      } else {
        consecutiveFailures += 1;
        consecutiveSuccesses = 0;

        // 3 consecutive failures to trigger DOWN status
        if (consecutiveFailures >= 3 && monitor.status !== MonitorStatus.DOWN) {
          nextStatus = MonitorStatus.DOWN;
          statusChanged = true;

          // Open incident if none already open
          const openIncident = await tx.incident.findFirst({
            where: {
              monitorId: monitor.id,
              status: IncidentStatus.OPEN,
            },
          });

          if (!openIncident) {
            await tx.incident.create({
              data: {
                monitorId: monitor.id,
                status: IncidentStatus.OPEN,
                cause: errorMessage || errorType || 'Check failed',
                failedChecksCount: 1,
              },
            });
          }
        } else if (monitor.status === MonitorStatus.DOWN) {
          // Increment failed checks count on existing incident
          await tx.incident.updateMany({
            where: {
              monitorId: monitor.id,
              status: IncidentStatus.OPEN,
            },
            data: {
              failedChecksCount: { increment: 1 },
            },
          });
        }
      }

      // Update monitor
      await tx.monitor.update({
        where: { id: monitor.id },
        data: {
          status: nextStatus,
          consecutiveSuccesses,
          consecutiveFailures,
          lastCheckedAt: new Date(),
          lastStatusChangeAt: statusChanged ? new Date() : undefined,
        },
      });
    });

    logger.info(
      { monitorId, isSuccess, statusCode, responseTimeMs, errorType },
      `Probe completed: ${monitor.name} -> ${isSuccess ? 'UP' : 'FAILED'}`
    );
  } catch (dbErr) {
    logger.error({ dbErr, monitorId }, 'Failed to persist probe result');
  }

  return {
    monitorId,
    isSuccess,
    statusCode,
    responseTimeMs,
    errorType,
    errorMessage,
  };
}

/**
 * Routine probe runner: checks all active monitors that are due for a probe
 */
export async function runActiveProbesCycle(): Promise<number> {
  try {
    const activeMonitors = await prisma.monitor.findMany({
      where: { isActive: true },
    });

    const now = Date.now();
    let probedCount = 0;

    for (const monitor of activeMonitors) {
      const lastCheckTime = monitor.lastCheckedAt ? new Date(monitor.lastCheckedAt).getTime() : 0;
      const intervalMs = monitor.intervalSeconds * 1000;

      // Probe if never checked or if interval has elapsed
      if (!monitor.lastCheckedAt || now - lastCheckTime >= intervalMs) {
        probedCount++;
        // Execute probe asynchronously without blocking other probes
        executeProbe(monitor.id).catch((err) => {
          logger.error({ err, monitorId: monitor.id }, 'Probe cycle failure');
        });
      }
    }

    return probedCount;
  } catch (err) {
    logger.error({ err }, 'Error running active probes cycle');
    return 0;
  }
}
