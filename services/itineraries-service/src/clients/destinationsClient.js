const axios = require('axios');
const CircuitBreaker = require('opossum');
const env = require('../config/env');
const logger = require('../utils/logger');
const { ServiceUnavailableError } = require('../utils/errors');

const http = axios.create({ baseURL: env.destinationsServiceUrl, timeout: 3000 });

const BREAKER_OPTIONS = {
  timeout: 3000, // a call that hangs this long counts as a failure
  errorThresholdPercentage: 50, // trip open once half of recent calls fail
  resetTimeout: 10000, // stay open 10s before trying a single test request again
  rollingCountTimeout: 10000,
};

// Returns the destination, or null if it does not exist (404) - a 404 is a normal business
// outcome, not a fault, so it resolves normally and never trips the breaker.
async function rawGetDestinationById(id) {
  try {
    const res = await http.get(`/api/destinations/${id}`);
    return res.data.data;
  } catch (err) {
    if (err.response && err.response.status === 404) return null;
    throw err;
  }
}

async function rawGetDestinationsByIds(ids) {
  if (!ids.length) return [];
  const res = await http.get('/internal/destinations/by-ids', { params: { ids: ids.join(',') } });
  return res.data.data;
}

const getByIdBreaker = new CircuitBreaker(rawGetDestinationById, BREAKER_OPTIONS);
const getByIdsBreaker = new CircuitBreaker(rawGetDestinationsByIds, BREAKER_OPTIONS);

for (const [name, breaker] of [['getDestinationById', getByIdBreaker], ['getDestinationsByIds', getByIdsBreaker]]) {
  breaker.on('open', () => logger.warn(`Circuit OPEN for destinations-service.${name} - failing fast`));
  breaker.on('halfOpen', () => logger.info(`Circuit HALF-OPEN for destinations-service.${name} - testing recovery`));
  breaker.on('close', () => logger.info(`Circuit CLOSED for destinations-service.${name} - recovered`));
}

// While the circuit is open, adding a new item that needs destination validation fails fast
// with a clear 503 instead of every request hanging for 3s waiting on a service that's down.
getByIdBreaker.fallback(() => {
  throw ServiceUnavailableError('Destinations service is currently unavailable, please try again shortly');
});
// Enrichment is best-effort by design (see itineraries.service.js), so its fallback returns
// an empty list rather than throwing - the itinerary is still returned, just without embedded
// destination details.
getByIdsBreaker.fallback(() => []);

async function getDestinationById(id) {
  return getByIdBreaker.fire(id);
}

async function getDestinationsByIds(ids) {
  return getByIdsBreaker.fire(ids);
}

module.exports = { getDestinationById, getDestinationsByIds };
