require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4003,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'CHANGE_ME',
  destinationsServiceUrl: process.env.DESTINATIONS_SERVICE_URL || 'http://localhost:4002',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  nodeEnv: process.env.NODE_ENV || 'development',
};
