const amqplib = require('amqplib');
const env = require('../config/env');
const logger = require('../utils/logger');

const EXCHANGE = 'globetrotter.events';

let channelPromise = null;

// Lazily connects to RabbitMQ and caches the channel. If the broker is unreachable
// (e.g. Phase 2 demo without RabbitMQ running), publishing degrades to a no-op instead
// of crashing the request - the queue is an optimization (fast cache invalidation),
// not a hard dependency of the itineraries-service write path.
async function getChannel() {
  if (!channelPromise) {
    channelPromise = amqplib
      .connect(env.rabbitmqUrl)
      .then(async (connection) => {
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE, 'fanout', { durable: false });
        connection.on('error', () => {
          channelPromise = null;
        });
        return channel;
      })
      .catch((err) => {
        channelPromise = null;
        throw err;
      });
  }
  return channelPromise;
}

async function publish(eventType, payload) {
  try {
    const channel = await getChannel();
    const message = Buffer.from(JSON.stringify({ eventType, payload, emittedAt: new Date().toISOString() }));
    channel.publish(EXCHANGE, '', message);
    logger.info(`Published event ${eventType}`);
  } catch (err) {
    logger.warn(`Could not publish event ${eventType} (RabbitMQ unavailable): ${err.message}`);
  }
}

module.exports = { publish };
