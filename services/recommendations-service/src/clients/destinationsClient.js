const axios = require('axios');
const CircuitBreaker = require('opossum');
const env = require('../config/env');
const logger = require('../utils/logger');
const { ServiceUnavailableError } = require('../utils/errors');

const http = axios.create({ baseURL: env.destinationsServiceUrl, timeout: 5000 });

const BREAKER_OPTIONS = { timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 10000, rollingCountTimeout: 10000 };

async function rawGetAllDestinations() {
  const res = await http.get('/internal/destinations');
  return res.data.data;
}

const breaker = new CircuitBreaker(rawGetAllDestinations, BREAKER_OPTIONS);
breaker.on('open', () => logger.warn('Circuit OPEN for destinations-service.getAllDestinations - failing fast'));
breaker.on('halfOpen', () => logger.info('Circuit HALF-OPEN for destinations-service.getAllDestinations - testing recovery'));
breaker.on('close', () => logger.info('Circuit CLOSED for destinations-service.getAllDestinations - recovered'));

// The whole catalogue is essential to scoring - no destinations, no recommendations - so
// this fails loudly (503) rather than pretending an empty catalogue is a valid answer.
breaker.fallback(() => {
  throw ServiceUnavailableError('Destinations service is currently unavailable, please try again shortly');
});

async function getAllDestinations() {
  return breaker.fire();
}

module.exports = { getAllDestinations };
