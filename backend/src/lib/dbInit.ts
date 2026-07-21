import { prisma } from './prisma.js';
import bcrypt from 'bcrypt';
import { logger } from './logger.js';
import { HttpMethod, MonitorStatus } from '@prisma/client';

export async function initDbAndSeed() {
  try {
    // 1. Create partial unique index on incidents: UNIQUE (monitor_id) WHERE status = 'OPEN'
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_incidents_one_open_per_monitor 
      ON incidents (monitor_id) 
      WHERE status = 'OPEN';
    `);
    logger.info('Database partial unique index verified: idx_incidents_one_open_per_monitor');

    // 2. Check if demo user exists
    const demoEmail = 'demo@pulsewatch.dev';
    const existing = await prisma.user.findUnique({ where: { email: demoEmail } });

    if (!existing) {
      const passwordHash = await bcrypt.hash('demo123456', 12);
      const user = await prisma.user.create({
        data: {
          email: demoEmail,
          name: 'Demo Engineer',
          passwordHash,
        },
      });

      // Create 3 demo monitors
      const m1 = await prisma.monitor.create({
        data: {
          userId: user.id,
          name: 'Public API Gateway',
          url: 'https://httpbin.org/status/200',
          method: HttpMethod.GET,
          intervalSeconds: 60,
          timeoutMs: 5000,
          expectedStatusMin: 200,
          expectedStatusMax: 299,
          status: MonitorStatus.UP,
          isActive: true,
          consecutiveSuccesses: 142,
          consecutiveFailures: 0,
          lastCheckedAt: new Date(),
        },
      });

      const m2 = await prisma.monitor.create({
        data: {
          userId: user.id,
          name: 'Auth Service Health',
          url: 'https://api.github.com',
          method: HttpMethod.GET,
          intervalSeconds: 120,
          timeoutMs: 10000,
          expectedStatusMin: 200,
          expectedStatusMax: 399,
          status: MonitorStatus.UP,
          isActive: true,
          consecutiveSuccesses: 85,
          consecutiveFailures: 0,
          lastCheckedAt: new Date(Date.now() - 30 * 1000),
        },
      });

      const m3 = await prisma.monitor.create({
        data: {
          userId: user.id,
          name: 'Payments Webhook Receiver',
          url: 'https://example.com/webhook',
          method: HttpMethod.HEAD,
          intervalSeconds: 300,
          timeoutMs: 10000,
          expectedStatusMin: 200,
          expectedStatusMax: 299,
          status: MonitorStatus.PAUSED,
          isActive: false,
          consecutiveSuccesses: 10,
          consecutiveFailures: 0,
          lastCheckedAt: new Date(Date.now() - 10 * 60 * 1000),
        },
      });

      // Add a few historical checks for m1 and m2
      const now = Date.now();
      await prisma.check.createMany({
        data: [
          { monitorId: m1.id, isSuccess: true, statusCode: 200, responseTimeMs: 42, checkedAt: new Date(now - 60000) },
          { monitorId: m1.id, isSuccess: true, statusCode: 200, responseTimeMs: 38, checkedAt: new Date(now - 120000) },
          { monitorId: m1.id, isSuccess: true, statusCode: 200, responseTimeMs: 45, checkedAt: new Date(now - 180000) },
          { monitorId: m2.id, isSuccess: true, statusCode: 200, responseTimeMs: 110, checkedAt: new Date(now - 30000) },
          { monitorId: m2.id, isSuccess: true, statusCode: 200, responseTimeMs: 95, checkedAt: new Date(now - 150000) },
        ],
      });

      logger.info('Demo user and sample telemetry seeded: demo@pulsewatch.dev');
    }
  } catch (err) {
    logger.error({ err }, 'Error during DB initialization or seeding');
  }
}
