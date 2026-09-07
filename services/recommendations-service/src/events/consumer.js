const amqplib = require('amqplib');
const env = require('../config/env');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

const EXCHANGE = 'globetrotter.events';
const RETRY_DELAY_MS = 5000;

// This is the payoff of combining the cache (Phase 4a) with the message queue (Phase 4b):
// instead of a fixed TTL being the only way stale recommendations expire, itineraries-service
// broadcasts a fanout event on every write, and this consumer reactively evicts exactly the
// affected user's cached recommendations - the next request recomputes fresh data immediately.
async function handleMessage(msg) {
  if (!msg) return;
  try {
    const { eventType, payload } = JSON.parse(msg.content.toString());
    logger.info(`Received event ${eventType}`, payload);
    if (payload && payload.userId) {
      await cache.delPattern(`recommendations:${payload.userId}:*`);
    }
  } catch (err) {
    logger.error(`Failed to process event: ${err.message}`);
  }
}

let retryScheduled = false;

function scheduleRetry() {
  if (retryScheduled) return;
  retryScheduled = true;
  setTimeout(() => {
    retryScheduled = false;
    start();
  }, RETRY_DELAY_MS);
}

// Degrades gracefully: if RabbitMQ is down (e.g. during a Phase 2/3 demo without the broker
// running), the service keeps serving requests normally - recommendations just fall back to
// the plain cache TTL instead of being evicted early.
async function start() {
  try {
    const connection = await amqplib.connect(env.rabbitmqUrl);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, 'fanout', { durable: false });
    const { queue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue, EXCHANGE, '');

    channel.consume(queue, (msg) => {
      handleMessage(msg);
      if (msg) channel.ack(msg);
    });

    logger.info('Connected to RabbitMQ - listening for itinerary events to invalidate the recommendations cache');

    connection.on('error', (err) => {
      logger.warn(`RabbitMQ connection error: ${err.message}`);
      scheduleRetry();
    });
    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed, will retry');
      scheduleRetry();
    });
  } catch (err) {
    logger.warn(`RabbitMQ unavailable (${err.message}), retrying in ${RETRY_DELAY_MS}ms`);
    scheduleRetry();
  }
}

module.exports = { start };
