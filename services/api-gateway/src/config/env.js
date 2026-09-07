require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  usersServiceUrl: process.env.USERS_SERVICE_URL || 'http://localhost:4001',
  destinationsServiceUrl: process.env.DESTINATIONS_SERVICE_URL || 'http://localhost:4002',
  itinerariesServiceUrl: process.env.ITINERARIES_SERVICE_URL || 'http://localhost:4003',
  recommendationsServiceUrl: process.env.RECOMMENDATIONS_SERVICE_URL || 'http://localhost:4004',
  nodeEnv: process.env.NODE_ENV || 'development',
};
