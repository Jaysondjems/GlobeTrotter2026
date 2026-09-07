require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4004,
  usersServiceUrl: process.env.USERS_SERVICE_URL || 'http://localhost:4001',
  destinationsServiceUrl: process.env.DESTINATIONS_SERVICE_URL || 'http://localhost:4002',
  itinerariesServiceUrl: process.env.ITINERARIES_SERVICE_URL || 'http://localhost:4003',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  nodeEnv: process.env.NODE_ENV || 'development',
};
