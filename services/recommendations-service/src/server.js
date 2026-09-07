const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const eventsConsumer = require('./events/consumer');

const server = app.listen(env.port, () => {
  logger.info(`recommendations-service listening on port ${env.port} (${env.nodeEnv})`);
});

eventsConsumer.start();

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
