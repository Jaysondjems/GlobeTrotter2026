const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/db');

const server = app.listen(env.port, () => {
  logger.info(`GlobeTrotter backend listening on port ${env.port} (${env.nodeEnv})`);
  logger.info(`Swagger docs available at http://localhost:${env.port}/api-docs`);
});

async function shutdown(signal) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
