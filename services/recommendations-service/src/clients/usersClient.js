const axios = require('axios');
const CircuitBreaker = require('opossum');
const env = require('../config/env');
const logger = require('../utils/logger');
const { ServiceUnavailableError } = require('../utils/errors');

const http = axios.create({ baseURL: env.usersServiceUrl, timeout: 3000 });

const BREAKER_OPTIONS = { timeout: 3000, errorThresholdPercentage: 50, resetTimeout: 10000, rollingCountTimeout: 10000 };

async function rawGetUserById(id) {
  try {
    const res = await http.get(`/api/users/${id}`);
    return res.data.data;
  } catch (err) {
    if (err.response && err.response.status === 404) return null;
    throw err;
  }
}

const breaker = new CircuitBreaker(rawGetUserById, BREAKER_OPTIONS);
breaker.on('open', () => logger.warn('Circuit OPEN for users-service.getUserById - failing fast'));
breaker.on('halfOpen', () => logger.info('Circuit HALF-OPEN for users-service.getUserById - testing recovery'));
breaker.on('close', () => logger.info('Circuit CLOSED for users-service.getUserById - recovered'));

// Without the user's preferences/budget there is nothing meaningful to score, so this
// fallback fails loudly (503) rather than silently returning empty recommendations.
breaker.fallback(() => {
  throw ServiceUnavailableError('Users service is currently unavailable, please try again shortly');
});

async function getUserById(id) {
  return breaker.fire(id);
}

module.exports = { getUserById };
