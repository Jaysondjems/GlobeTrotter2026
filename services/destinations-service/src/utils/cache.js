const { createClient } = require('redis');
const env = require('../config/env');
const logger = require('./logger');

// Cache-aside helper with graceful degradation: if Redis is unreachable, every operation
// resolves to a safe no-op (get -> null, set/del -> ignored) instead of failing the request.
// The cache is an optimization here, never a hard dependency of the read path.
const client = createClient({
  url: env.redisUrl,
  socket: { connectTimeout: 2000, reconnectStrategy: false },
});
client.on('error', (err) => logger.warn(`Redis error: ${err.message}`));

let connected = false;

async function ensureConnected() {
  if (connected) return;
  await client.connect();
  connected = true;
}

async function get(key) {
  try {
    await ensureConnected();
    const value = await client.get(key);
    if (value) logger.info(`Cache HIT ${key}`);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    connected = false;
    logger.warn(`Cache unavailable (GET ${key}): ${err.message}`);
    return null;
  }
}

async function set(key, value, ttlSeconds) {
  try {
    await ensureConnected();
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    connected = false;
    logger.warn(`Cache unavailable (SET ${key}): ${err.message}`);
  }
}

async function delPattern(pattern) {
  try {
    await ensureConnected();
    const keys = await client.keys(pattern);
    if (keys.length) await client.del(keys);
    logger.info(`Cache invalidated ${pattern} (${keys.length} keys)`);
  } catch (err) {
    connected = false;
    logger.warn(`Cache unavailable (DEL ${pattern}): ${err.message}`);
  }
}

module.exports = { get, set, delPattern };
