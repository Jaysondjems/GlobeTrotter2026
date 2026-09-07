const axios = require('axios');
const CircuitBreaker = require('opossum');
const env = require('../config/env');
const logger = require('../utils/logger');

const http = axios.create({ baseURL: env.itinerariesServiceUrl, timeout: 3000 });

const BREAKER_OPTIONS = { timeout: 3000, errorThresholdPercentage: 50, resetTimeout: 10000, rollingCountTimeout: 10000 };

async function rawGetItinerariesForUser(userId) {
  const res = await http.get(`/internal/itineraries/by-user/${userId}`);
  return res.data.data;
}

const breaker = new CircuitBreaker(rawGetItinerariesForUser, BREAKER_OPTIONS);
breaker.on('open', () => logger.warn('Circuit OPEN for itineraries-service.getItinerariesForUser - failing fast'));
breaker.on('halfOpen', () => logger.info('Circuit HALF-OPEN for itineraries-service.getItinerariesForUser - testing recovery'));
breaker.on('close', () => logger.info('Circuit CLOSED for itineraries-service.getItinerariesForUser - recovered'));

// Past-trip history is a "nice to have" signal (+20 points), not essential: if
// itineraries-service is down, degrade to recommendations based only on preferences,
// popularity and budget rather than failing the whole request.
breaker.fallback(() => {
  logger.warn('itineraries-service unavailable - scoring without travel history');
  return [];
});

async function getItinerariesForUser(userId) {
  return breaker.fire(userId);
}

module.exports = { getItinerariesForUser };
