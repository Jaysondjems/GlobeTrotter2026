const prisma = require('../../config/db');
const logger = require('../../utils/logger');

async function check(req, res) {
  let databaseStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    logger.error('Health check: database connection failed', err.message);
    databaseStatus = 'disconnected';
  }

  const status = databaseStatus === 'connected' ? 'ok' : 'degraded';
  return res.status(200).json({ status, database: databaseStatus });
}

module.exports = { check };
