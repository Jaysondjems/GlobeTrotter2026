const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

const server = app.listen(env.port, () => {
  logger.info(`api-gateway listening on port ${env.port} (${env.nodeEnv})`);
  logger.info('Routing: /api/auth,/api/users -> users-service | /api/destinations -> destinations-service');
  logger.info('Routing: /api/itineraries,/api/shared -> itineraries-service | /api/users/:id/recommendations -> recommendations-service');
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
