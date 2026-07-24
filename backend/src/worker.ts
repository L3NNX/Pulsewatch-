import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';

logger.info('🚀 PulseWatch Queue Worker initializing...');

// Will be expanded in Batch 2
async function startWorker() {
  logger.info('Worker ready for queue jobs.');
}

startWorker().catch((err) => {
  logger.error({ err }, 'Worker fatal error');
  process.exit(1);
});
