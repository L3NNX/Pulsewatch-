import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { initDbAndSeed } from './lib/dbInit.js';
import { runActiveProbesCycle } from './services/probeService.js';

let probeInterval: NodeJS.Timeout | null = null;

async function bootstrap() {
  // Initialize partial unique index and seed demo data if needed
  await initDbAndSeed();

  const server = app.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, nodeEnv: env.NODE_ENV },
      `🚀 PulseWatch API server running on http://localhost:${env.PORT}`
    );

    // Initial probe cycle
    runActiveProbesCycle().catch((err) => logger.error({ err }, 'Initial probe cycle failed'));

    // Periodic probe cycle every 15s to catch any due monitors
    probeInterval = setInterval(() => {
      runActiveProbesCycle().catch((err) => logger.error({ err }, 'Periodic probe cycle failed'));
    }, 15000);
  });

  // Graceful shutdown
  async function gracefulShutdown(signal: string) {
    logger.info({ signal }, 'Graceful shutdown initiated');
    if (probeInterval) clearInterval(probeInterval);

    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await prisma.$disconnect();
        logger.info('Database connection closed');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error during database disconnect');
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000).unref();
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Server fatal bootstrap error');
  process.exit(1);
});
