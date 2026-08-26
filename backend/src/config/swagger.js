const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GlobeTrotter Travel Assistant API - Phase 1 (Monolith)',
      version: '1.0.0',
      description:
        'REST API for the GlobeTrotter Travel Assistant monolith (Phase 1): users, authentication, ' +
        'destinations, recommendations, itineraries and itinerary sharing.',
    },
    servers: [{ url: '/', description: 'Current server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.js'],
};

module.exports = swaggerJsdoc(options);
